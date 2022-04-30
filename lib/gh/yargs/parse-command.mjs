import { find } from 'lodash-es'
import { importExternalCommand } from './utils.mjs'

// a worker/query can be from a built in file or an external path
// to a file. this function handles both and merges in any options
// from external files
const parseCommand = async ({ workers, queries, argv }) => {
  const importExternal = (p) => importExternalCommand(p, argv)

  const findOrImport = async (items, arg) =>
    find(items, { name: arg }) || (await importExternal(arg))

  const positionals = argv._

  // two positionals
  // [worker, query]
  if (positionals.length === 2) {
    return {
      worker: await findOrImport(workers, positionals[0]),
      query: await findOrImport(queries, positionals[1]),
    }
  }

  // if there is only one, treat it as a worker
  // which needs to specify its own query by name/path
  const worker = find(workers, { name: positionals[0] })
  if (worker) {
    return {
      worker,
      query: await findOrImport(queries, worker.type),
    }
  }

  // if only a named query, then worker is null
  // which means just the query data is returned
  const query = find(queries, { name: positionals[0] })
  if (query) {
    return {
      worker: null,
      query,
    }
  }

  // otherwise load it as an external file which is
  // a worker that specifies a query
  // XXX: should it be possible to run only an external
  // query? maybe by specifying a `type` in the file?
  const externalWorker = await importExternal(positionals[0])
  if (externalWorker) {
    return {
      worker: externalWorker,
      query: await importExternal(externalWorker.type),
    }
  }

  throw new Error('Could not parse command')
}

export default parseCommand
