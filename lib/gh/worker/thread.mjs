import { join } from 'path'
import { property, constant, isFunction, omit, identity } from 'lodash-es'
import sodium from 'libsodium-wrappers'
import { spawnSync, runDryCommand } from '../../utils.mjs'

export const EXIT = Symbol('EXIT')

const makeRun =
  ({ dryRun, debug, postMessage, options: defaultOptions }) =>
  (
    command,
    args = [],
    {
      status: getStatus = property('status'),
      parse: parseResult,
      message: parseMessage = identity,
      ...options
    } = {}
  ) => {
    const message = {
      command: parseMessage(`${command} ${args.join(' ')}`),
      options,
    }
    postMessage({ command: message })

    const spawnOptions = {
      encoding: 'utf-8',
      shell: true,
      ...defaultOptions,
      ...options,
      env: {
        ...process.env,
        ...defaultOptions?.env,
        ...options?.env,
      },
    }

    const {
      status: rawStatus,
      output,
      stdout,
      stderr,
    } = dryRun
      ? runDryCommand({ debug })
      : spawnSync(command, args, spawnOptions)

    const result = {
      options: omit(spawnOptions, 'env', 'shell', 'encoding'),
      rawStatus,
      status: rawStatus,
      stderr: (stderr ?? '').trim(),
      stdout: (stdout ?? '').trim(),
      output: (output ?? [])
        .filter(Boolean)
        .map((o) => o.trim())
        .join('\n')
        .trim(),
    }

    if (typeof parseResult === 'function') {
      result.output = parseResult(result.output)
    }

    // commands can override status to handle expected errors
    const overrideStatus = getStatus(result)
    if (typeof overrideStatus === 'number') {
      result.status = overrideStatus
    } else if (overrideStatus === EXIT) {
      result.exit = true
    }

    postMessage({ command: result })

    if (result.status !== 0) {
      const err = new Error(`Command failed: ${message.command}`)
      throw Object.assign(err, { output })
    }

    return result
  }

const runCommands = (commands, state, runCommand, { isNested } = {}) => {
  if (!commands || !Array.isArray(commands)) {
    return
  }

  for (const getCommand of commands) {
    if (!isNested) {
      state.nextStep()
    }

    const command = isFunction(getCommand) ? getCommand(state) : getCommand

    if (!command) {
      // Allow for commands to conditionally return null to skip
      continue
    }

    if (
      // A nested command will return other commands as arrays or functions
      command.every((arg) => typeof arg === 'function' || Array.isArray(arg))
    ) {
      runCommands(command, state, runCommand, { isNested: true })
    } else {
      const [cmd, args, cmdOptions] = command
      // Overwrite options with command options so we can have a default cwd
      // for commands but also have it possible overridden per command
      state.result = runCommand(cmd, args, cmdOptions)
      state.results.push(state.result)
      if (state.result.exit) {
        return
      }
    }
  }
}

const main = async ({
  item = {},
  worker,
  argv,
  commandsKey = 'default',
  postMessage = () => {},
}) => {
  const { dryRun, debug, cwd } = argv
  const options = {}

  if (item.owner && cwd) {
    item.ownerDir = join(cwd, item.owner)
    if (item.name) {
      item.repoDir = join(cwd, item.owner, item.name)
      options.cwd = item.repoDir
    }
  }

  // These options cannot be overriden by commands
  const run = makeRun({ dryRun, debug, postMessage, options })

  let currentStep = 0

  // the sodium package needs to be awaited before any of its functions can be
  // used. because our individual workers are synchronous, we need to wait it
  // here and pass it along to each worker once it is ready.
  await sodium.ready

  const commandState = {
    sodium,
    item,
    argv,
    result: null,
    results: [],
    state: {},
    // Make current step a readonly getter
    // and update it via an explicit method
    get step() {
      return currentStep
    },
    nextStep() {
      currentStep++
      postMessage({ step: currentStep })
    },
    postMessage,
    run: (...args) => run(...args).output,
    _run: run,
  }

  const { [commandsKey]: commands = [], success = constant('') } =
    typeof worker === 'string' ? await import(worker) : worker

  postMessage({ global: { step: commandState.step, total: commands.length } })

  runCommands(commands, commandState, run)

  postMessage({
    message: `Success: ${success(commandState)}`.trim().replace(/:$/, ''),
  })
}

export default main
