import { Worker } from 'worker_threads'
import { serializeError } from 'serialize-error'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import mainWorker from './thread.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const statuses = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  RUNNING: 'RUNNING',
  WAITING: 'WAITING',
}

const runWorker = async ({
  item,
  render,
  workerData: argv,
  worker: workerPath,
}) => {
  const result = await new Promise((resolve) => {
    const state = { commands: [] }
    const workerData = {
      item,
      argv,
      worker: workerPath,
    }

    const ready = () => render.update(item, { status: statuses.RUNNING })
    const exit = (code = 0) => resolve({ ...state, code })
    const error = (err) => resolve({ ...state, code: 1, error: err })
    const message = ({ command, global, ...data }) => {
      if (command) {
        if (command.command) {
          state.commands.push(command)
          data.message = command.command
        } else {
          Object.assign(state.commands.at(-1), command)
        }
      }

      if (global) {
        render.update(global)
      }

      render.update(item, data)
    }

    if (argv.limit === 1) {
      // If the worker is running sequentially then
      // we dont need to spin up a thread. This is helpful
      // if the worker isn't doing any heavy lifting and just
      // making some api calls.
      ready()
      return mainWorker({ ...workerData, postMessage: message })
        .then(exit)
        .catch(error)
    }

    new Worker(join(__dirname, 'run-thread.mjs'), { workerData })
      .on('online', ready)
      .on('message', message)
      .on('error', error)
      .on('exit', exit)
  })

  if (result.code !== 0 && !result.error) {
    result.error = new Error(`Worker exited with code ${result.code}`)
  }

  render.update(item, {
    code: result.code,
    ...(result.error
      ? { status: statuses.ERROR, message: result.error.message }
      : { status: statuses.SUCCESS }),
  })

  return {
    ...result,
    error: serializeError(result.error),
  }
}

export default runWorker
