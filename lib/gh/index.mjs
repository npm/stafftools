import { mkdir, rm } from 'fs/promises'
import assert from 'assert'
import { PromisePool } from '@supercharge/promise-pool'
import { uniqBy } from 'lodash-es'
import runWorker from './worker/main.mjs'
import mainWorker from './worker/thread.mjs'
import { waitForAnyKey } from '../stdin.mjs'

const run = async ({
  cwd,
  id,
  sort,
  clean,
  limit,
  dryRun,
  render,
  filter,
  workerData,
  command: { worker, query },
}) => {
  if (!dryRun && cwd) {
    if (clean) {
      render.progress('Cleaning dir...')
      await rm(cwd, { recursive: true, force: true })
    }
    await mkdir(cwd, { recursive: true })
  }

  render.progress(`Fetching data...`)
  const rawData = query.default({ render, ...workerData })
  render.debug('RAW DATA:', rawData.length)

  // sort before filtering in case filter is using the index
  const sortedData = rawData.sort((a, b) =>
    (a[sort] || '')
      .toString()
      .localeCompare(b[sort] || '')
      .toString()
  )

  const filteredData = filter(sortedData)
  render.debug('FILTER DATA:', filteredData.length)

  // name and owner and used to set directories
  const requiredKeys = ['name', 'owner', id]
  assert(
    filteredData.every((item) =>
      requiredKeys.every((k) => Object.hasOwn(item, k))
    ),
    `all data must have the required keys: '${requiredKeys}'`
  )

  // make items uniq by id to avoid duplicate work
  const items = uniqBy(filteredData, id)
  render.debug('UNIQ DATA:', items.length)

  if (!worker) {
    return items
  }

  if (!items.length) {
    throw Object.assign(
      new Error('No items were returned from the query after filtering'),
      {
        noStack: true,
        code: 0,
      }
    )
  }

  const confirmItems = query.template.default.confirm(items)
  let confirm = `Running worker "${worker.name}" which will `
  confirm += `"${worker.args.desc}" on the following items:\n${confirmItems}\n\n`
  confirm += `Press any key to continue or CTRL+C to exit`

  render.log(confirm)
  try {
    // reject on ctrl+c
    await waitForAnyKey((b) => b[0] === 3 || b[0] === 4)
  } catch (e) {
    throw Object.assign(e, { noStack: true })
  }

  let abortError = null
  render.progress('Starting workers...')
  render.debug('workerData', workerData)

  await mainWorker({
    worker: worker.path,
    argv: workerData,
    commandsKey: 'before',
  })

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
        worker: worker.path,
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
