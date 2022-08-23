import { join } from 'path'
import { property, constant, isFunction } from 'lodash-es'
import { spawnSync, runDryCommand } from '../../utils.mjs'

const makeRun =
  ({ dryRun, debug, postMessage }) =>
  (
    command,
    args = [],
    { cwd, status: getStatus = property('status') } = {}
  ) => {
    const message = {
      command: `${command} ${args.join(' ')}`,
      cwd,
    }
    postMessage({ command: message })

    let { status: rawStatus, output } = dryRun
      ? runDryCommand({ debug })
      : spawnSync(command, args, { cwd, encoding: 'utf-8', shell: true })

    output = (output ?? [])
      .filter(Boolean)
      .map((o) => o.trim())
      .join('\n')
      .trim()

    // commands can override status to handle expected errors
    const overrideStatus = getStatus({ status: rawStatus, output })
    const status =
      typeof overrideStatus === 'number' ? overrideStatus : rawStatus

    const result = { rawStatus, status, output }
    postMessage({ command: result })

    if (status !== 0) {
      const err = new Error(`Command failed: ${message.command}`)
      throw Object.assign(err, {
        ...message,
        ...result,
      })
    }

    return result
  }

const runCommands = (commands, state, options) => {
  for (const getCommand of commands.filter(Boolean)) {
    if (!options.isNested) {
      state.nextStep()
    }

    const command = isFunction(getCommand) ? getCommand(state) : getCommand

    if (
      // A nested command will return other commands as arrays or functions
      command.every((arg) => typeof arg === 'function' || Array.isArray(arg))
    ) {
      runCommands(command, state, { ...options, isNested: true })
    } else {
      const [cmd, args, cmdOptions] = command
      // Overwrite options with command options so we can have a default cwd
      // for commands but also have it possible overridden per command
      state.result = options.forEach(cmd, args, { ...options, ...cmdOptions })
    }
  }
}

const main = async ({ item, worker, argv, postMessage }) => {
  const { dryRun, debug, cwd } = argv

  item.ownerDir = join(cwd, item.owner)
  item.repoDir = join(cwd, item.owner, item.name)

  // These options cannot be overriden by commands
  const run = makeRun({ dryRun, debug, postMessage })

  let currentStep = 0

  const commandState = {
    item,
    argv,
    result: null,
    // Make current step a readonly getter
    // and update it via an explicit method
    get step() {
      return currentStep
    },
    nextStep() {
      currentStep++
      postMessage({ step: currentStep })
    },
    // Supply these so commands can do their own running or posting
    // of updates to the main thread
    postMessage,
    run,
  }

  const { default: commands, success = constant('') } = await import(worker)

  postMessage({ global: { step: commandState.step, total: commands.length } })

  runCommands(commands, commandState, {
    cwd: item.repoDir,
    forEach: run,
  })

  postMessage({
    message: `Success: ${success(commandState)}`.trim().replace(/:$/, ''),
  })
}

export default main
