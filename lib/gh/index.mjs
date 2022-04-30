import { mkdir, rm } from 'fs/promises'
import assert from 'assert'
import { PromisePool } from '@supercharge/promise-pool'
import { uniqBy } from 'lodash-es'
import runWorker from './worker/main.mjs'

const run = async ({
  cwd,
  idKey,
  clean,
  limit,
  dryRun,
  render,
  command,
  workerData,
}) => {
  if (!dryRun) {
    if (clean) {
      render.progress('Cleaning dir...')
      await rm(cwd, { recursive: true, force: true })
    }
    await mkdir(cwd, { recursive: true })
  }

  render.progress(`Fetching data...`)
  const rawData = command.query({ render, ...workerData })
  render.debug('RAW DATA:', rawData.length)

  const filteredData = command.filter(rawData)
  render.debug('FILTER DATA:', filteredData.length)

  // name and owner and used to set directories
  const requiredKeys = ['name', 'owner', idKey]
  assert(
    filteredData.every((item) =>
      requiredKeys.every((k) => Object.hasOwn(item, k))
    ),
    `all data must have the required keys: '${requiredKeys}'`
  )

  // make items uniq by id to avoid duplicate work
  const items = uniqBy(filteredData, idKey)
  render.debug('UNIQ DATA:', items.length)

  if (!command.worker) {
    return items
  }

  let abortError = null
  render.progress('Starting workers...')
  render.debug('workerData', workerData)

  const res = await PromisePool.withConcurrency(limit)
    .for(render.init(items))
    .handleError(async (error, _, pool) => {
      // the only errors we should get here mean we cant
      // continue with any more works so stop and throw
      abortError = error
      return pool.stop()
    })
    .process(async (item) => ({
      ...item,
      result: await runWorker({
        item,
        render,
        worker: command.worker,
        workerData,
      }),
    }))

  render.done()

  if (abortError) {
    throw abortError
  }

  return res.results
}

export default run
