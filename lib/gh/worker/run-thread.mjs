import * as Worker from 'worker_threads'
import run from './thread.mjs'

if (Worker.isMainThread) {
  throw new Error('Should not be run on main thread')
}

run({
  ...Worker.workerData,
  postMessage: (v) => Worker.parentPort.postMessage(v),
})
