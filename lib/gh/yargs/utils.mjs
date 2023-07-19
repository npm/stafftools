import { pathToFileURL } from 'url'
import { identity, defaultsDeep, intersection } from 'lodash-es'
import Yargs from 'yargs'
import { readdirExt, absOrRel } from '../../utils.mjs'
import { WORKER } from '../types.mjs'
import { readProcessInput } from '../../stdin.mjs'

const importCommand = async (obj) => {
  return defaultsDeep({}, obj, await import(pathToFileURL(obj.path)), {
    args: { builder: identity },
  })
}

export const readdirCommands = async (dir) => {
  const js = await readdirExt(dir, '.mjs', '.js')
  return await Promise.all(js.map(importCommand))
}

export const importExternalCommand = async (p) => {
  const command = await importCommand({ path: absOrRel(p) })
  return {
    command,
    defaults: command.args.builder(Yargs('')).getOptions().default,
  }
}

const toArray = (val) => [].concat(val)

const allSymbols = (val) =>
  toArray(val).every((type) => typeof type === 'symbol')

const hasIntersection = (arr1, arr2) =>
  intersection(toArray(arr1), toArray(arr2)).length > 0

export const getQueriesByWorker = (queries, worker) => {
  // If type if a symbol it means there could be multiple related queries
  // and one has to be specified as a positional argument. So return an
  // array for showing the possible queries
  if (allSymbols(worker.type)) {
    return {
      queries: queries.filter(
        // queries without a type are valid for any worker
        (query) => !query.type || hasIntersection(worker.type, query.type)
      ),
    }
  }

  // Otherwise the worker type is either a path directly to a query or the name
  // of a query in our local queries directory
  if (typeof worker.type === 'string') {
    return {
      query: queries.find((query) =>
        hasIntersection(worker.type, [query.name, query.path])
      ),
    }
  }

  throw new Error(`Unknown type on worker ${worker.path}`)
}

export const getWorkersByQuery = (workers, query) => {
  if (!query.type) {
    return workers
  }

  if (allSymbols(query.type)) {
    return workers.filter(
      (worker) =>
        hasIntersection(query.type, worker.type) ||
        hasIntersection(worker.type, [query.path, query.name])
    )
  }

  throw new Error(`Unknown type on query ${query.path}`)
}

export const getTemplateByQuery = (templates, query) => {
  if (!query.type) {
    return null
  }

  if (allSymbols(query.type)) {
    return templates.find((template) =>
      hasIntersection(template.type, query.type)
    )
  }

  throw new Error(`Unknown type on query ${query.path}`)
}

export const getTemplateByWorker = (templates, workerType = WORKER) => {
  return templates.find((template) =>
    hasIntersection(template.type, workerType)
  )
}

export const templateOptions = (choices) =>
  choices.reduce((acc, k) => {
    acc[k] = {
      type: 'boolean',
      default: false,
      desc: `shorthand for --template=${k}`,
    }
    return acc
  }, {})

export const apiOnlyOptions = () => ({
  limit: {
    default: 1,
    hidden: true,
  },
  cwd: {
    default: null,
    demand: false,
  },
})

export const fallbackToStdin = (name, opts) => {
  const defValue = null
  return {
    handler: (argv) => {
      if (argv[name] === defValue) {
        throw new Error(
          `${name} is required to be set via an argument or stdin`
        )
      }
    },
    options: {
      [name]: {
        demand: true,
        default: defValue,
        type: 'string',
        coerce: async (v) => (v === defValue ? readProcessInput() : v),
        ...opts,
        desc: `${opts.desc ? `${opts.desc}, ` : ''}can also be set via stdin`,
      },
    },
  }
}
