import { Worker } from 'worker_threads'
import { serializeError } from 'serialize-error'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

export const statuses = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  RUNNING: 'RUNNING',
  WAITING: 'WAITING',
}

const workerThread = (data) =>
  new Worker(join(dirname(fileURLToPath(import.meta.url)), 'thread.mjs'), {
    workerData: data,
  })

const runWorker = async ({ item, render, workerData, worker: workerPath }) => {
  const result = await new Promise((resolve) => {
    const state = { commands: [] }

    const worker = workerThread({
      item,
      argv: workerData,
      worker: workerPath,
    })

    worker.on('online', () => render.update(item, { status: statuses.RUNNING }))

    worker.on('message', ({ command, global, ...data }) => {
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
    })

    worker.on('error', (error) => resolve({ ...state, code: 1, error }))
    worker.on('exit', (code) => resolve({ ...state, code }))
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
