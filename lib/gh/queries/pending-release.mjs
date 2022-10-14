import { flow } from 'lodash-es'
import { OPEN_PR } from '../types.mjs'
import baseQuery, * as base from './pull-requests.mjs'

export const type = OPEN_PR

export const filter = [...base.filter]

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

export default (opts) => {
  const res = baseQuery(opts)

  const names = res.map((r) => r.name)
  return opts.noDeps
    ? res.filter((item) => {
        const deps = Object.keys(item?.pkg?.dependencies ?? {})
        return deps.every((d) => !names.includes(d))
      })
    : res
}
