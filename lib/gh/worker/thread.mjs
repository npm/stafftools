import { join } from 'path'
import { spawnSync } from 'child_process'
import * as Worker from 'worker_threads'
import { property, defaults, constant, isFunction } from 'lodash-es'
import { runDryCommand } from '../utils.mjs'

if (Worker.isMainThread) {
  throw new Error('Should not be run on main thread')
}

const postMessage = (v) => Worker.parentPort.postMessage(v)
const { item, worker, argv } = Worker.workerData
item.ownerDir = join(argv.cwd, item.owner)
item.repoDir = join(argv.cwd, item.owner, item.name)

const run = (...runArgs) => {
  const { status: getStatus = property('status'), ...options } = defaults(
    typeof runArgs.at(-1) === 'object' ? runArgs.pop() : {},
    {
      shell: true,
      encoding: 'utf-8',
      cwd: item.repoDir,
    }
  )
  const [command, ...args] = runArgs

  const message = {
    command: `${command} ${args.join(' ')}`,
    cwd: options.cwd,
  }
  postMessage({ command: message })

  let { status: rawStatus, output } = argv.dryRun
    ? runDryCommand({ debug: argv.debug })
    : spawnSync(command, args, options)

  output = (output ?? [])
    .filter(Boolean)
    .map((o) => o.trim())
    .join('\n')
    .trim()

  // commands can override status to handle expected errors
  const overrideStatus = getStatus({ status: rawStatus, output })
  const status = typeof overrideStatus === 'number' ? overrideStatus : rawStatus

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

const commandData = {
  result: null,
  item,
  argv,
  postMessage,
  run,
}

let currentStep = 0

const { default: _commands, success = constant('') } = await import(worker)
const commands = isFunction(_commands) ? [_commands] : _commands

postMessage({ global: { step: currentStep, total: commands.length } })

for (const command of commands) {
  currentStep++
  postMessage({ step: currentStep })

  const result = command(commandData)

  if (Array.isArray(result)) {
    const subCommands = typeof result[0] === 'string' ? [result] : result
    for (const subCommand of subCommands) {
      commandData.result = Array.isArray(subCommand)
        ? run(...subCommand)
        : subCommand(commandData)
    }
    continue
  }

  commandData.result = result
}

postMessage({
  message: `Success: ${success(commandData)}`.replace(/:\s*$/, ''),
})
