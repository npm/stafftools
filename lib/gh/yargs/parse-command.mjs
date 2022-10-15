import { defaults as setDefaults, find, filter } from 'lodash-es'
import * as utils from './utils.mjs'

const _importCommand = async (items, arg, errorType, argv) => {
  try {
    const { command, defaults } = await utils.importExternalCommand(arg)
    // since it is external, supply any defaults from the builder function to the argv
    setDefaults(argv, defaults)
    return command
  } catch {
    const names = items.map((i) => i.name).join(', ')
    throw Error(
      [
        `Could not resolve ${errorType} \`${arg.toString()}\`.`,
        `Valid arguments are a name matching \`${names}\`,`,
        `an absolute path, or a path relative to \`${process.cwd()}\`.`,
      ].join(' ')
    )
  }
}

// a worker/query can be from a built in file or an external path
// to a file. this function handles both and merges in any options
// from external files
const parseCommand = async ({ workers, queries, argv }) => {
  const { _: positionals } = argv

  const importCommand = (...args) => _importCommand(...args, argv)

  const getQueryByWorker = async (worker) =>
    utils.getQueriesByWorker(queries, worker).query ??
    importCommand(
      filter(queries, { type: worker.type }),
      worker.type,
      `query from \`worker.type\` in worker \`${worker.path}\` with type`
    )

  // both query and worker were supplied as positionals
  // so use both of them to look up existing ones by name or as paths
  if (positionals.length === 2) {
    const [queryArg, workerArg] = positionals
    return {
      query:
        find(queries, { name: queryArg }) ??
        (await importCommand(queries, queryArg, 'query from positional')),
      worker:
        find(workers, { name: workerArg }) ??
        (await importCommand(workers, workerArg, 'worker from positional')),
    }
  }

  // A single positional can either be a query or a worker
  const arg = positionals[0]

  // If it is a valid worker, then it needs to have specified its query explicitly
  const worker = find(workers, { name: arg })
  if (worker) {
    return {
      query: await getQueryByWorker(worker),
      worker,
    }
  }

  // A valid query by itself has no worker, the results are just displayed
  const query = find(queries, { name: arg })
  if (query) {
    return {
      query,
    }
  }

  // We know it is not in queries or workers so it then has to be
  // a path to one of those
  // Its a worker if it comes with a valid query otherwise
  // it is just a query
  const queryOrWorker = await importCommand(
    [...queries, ...workers],
    arg,
    'query or worker from positional'
  )
  const queryFromWorker = await getQueryByWorker(queryOrWorker).catch(() => {})
  return queryFromWorker
    ? {
        query: queryFromWorker,
        worker: queryOrWorker,
      }
    : {
        query: queryOrWorker,
      }
}

const parseCommandWithTemplate = async ({ templates, ...rest }) => {
  const { query, worker } = await parseCommand(rest)
  query.template = utils.getTemplateByQuery(templates, query)
  if (worker) {
    worker.template = utils.getTemplateByWorker(templates, worker)
  }
  return {
    query,
    worker,
    template: worker?.template ?? query.template,
  }
}

export default parseCommandWithTemplate
