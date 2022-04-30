import { identity, defaultsDeep, defaults } from 'lodash-es'
import Yargs from 'yargs'
import { readdirExt, absOrRel } from '../utils.mjs'
import coerceFilter from './filter.mjs'

export const importCommand = async (p) => ({
  ...(typeof p === 'string' ? { path: p } : p),
  ...defaultsDeep({}, await import(typeof p === 'string' ? p : p.path), {
    args: { builder: identity },
  }),
})

export const readdirCommands = async (dir) => {
  const js = await readdirExt(dir, '.mjs', '.js')
  return await Promise.all(js.map(importCommand))
}

export const importExternalCommand = async (p, argv) => {
  const externalCommand = await importCommand(absOrRel(p))

  // since it is external, supply any defaults from the builder function
  // to the argv
  const defaultValues = externalCommand.args
    .builder(Yargs(''))
    .getOptions().default
  defaults(argv, defaultValues)

  return externalCommand
}

export const defaultFilter = (def) => ({
  'default-filter': {
    ...def,
    type: 'boolean',
    default: true,
    desc: 'whether to apply the default filter to the data',
    // if arg is true, create default filter, otherwise coerceFilter
    // returns an identity passthrough
    coerce: (arg) => coerceFilter(arg && def.default),
  },
})

export const templateOptions = (choices) =>
  choices.reduce((acc, k) => {
    acc[k] = {
      type: 'boolean',
      default: false,
      desc: `shorthand for --template=${k}`,
    }
    return acc
  }, {})
