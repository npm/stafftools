import { flow } from 'lodash-es'
import { OPEN_PR } from '../types.mjs'
import baseQuery, * as base from './pull-requests.mjs'

export const type = OPEN_PR

export const filter = [
  ...base.filter,
  (item, _, list, opts) => {
    if (opts.argv.noDeps) {
      const names = list.map((r) => r.name)
      const deps = Object.keys(item?.pkg?.dependencies ?? {})
      return deps.every((d) => !names.includes(d))
    }
    return true
  },
]

export const args = {
  desc: 'Fetch pending release pull requests',
  builder: flow(base.args.builder, (yargs) =>
    yargs.options({
      label: {
        default: 'autorelease: pending',
        hidden: true,
      },
      state: {
        hidden: true,
        default: 'OPEN',
      },
      noDeps: {
        default: false,
        type: 'boolean',
        desc: 'Only return items that do not depend on any other items returned',
      },
    })
  ),
}

export default baseQuery
