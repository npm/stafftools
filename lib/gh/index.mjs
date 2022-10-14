import { mkdir, rm } from 'fs/promises'
import assert from 'assert'
import { basename } from 'path'
import { PromisePool } from '@supercharge/promise-pool'
import { uniqBy } from 'lodash-es'
import runWorker from './worker/main.mjs'
import mainWorker from './worker/thread.mjs'

const confirmKey = () => {
  const { stdin } = process
  return new Promise((res, rej) => {
    const handler = (d) => {
      stdin.removeListener('data', handler)
      stdin.setRawMode(false)
      stdin.pause()
      const bytes = Array.from(d)
      if ((bytes.length && bytes[0] === 3) || bytes[0] === 4) {
        return rej(new Error('Program quit by user'))
      }
      return res()
    }
    stdin.resume()
    stdin.setRawMode(true)
    stdin.once('data', handler)
  })
}

const run = async ({
  cwd,
  idKey,
  clean,
  limit,
  dryRun,
  render,
  command,
  workerData,
  denyRepos,
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

  const filteredData = command
    .filter(rawData)
    .filter((r) => !denyRepos.includes(r.nameWithOwner))
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

  const itemKeys = items.map((i) => i[idKey]).join('\n')
  const { args } = await import(command.worker)
  let confirm = `About to run ${basename(command.worker)} which will `
  confirm += `"${args.desc}" on the following items:\n${itemKeys}\n\n`
  confirm += `Press any key to continue or CTRL+C to exit`

  render.log(confirm)
  try {
    await confirmKey()
  } catch (e) {
    throw Object.assign(e, { noStack: true })
  }

  let abortError = null
  render.progress('Starting workers...')
  render.debug('workerData', workerData)

  await mainWorker({
    worker: command.worker,
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
