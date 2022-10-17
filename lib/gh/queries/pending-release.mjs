import { flow } from 'lodash-es'
import { OPEN_PR } from '../types.mjs'
import baseQuery, * as base from './pull-requests.mjs'

export const type = OPEN_PR

export const filter = [
  ...base.filter,
  (item, _, list, opts) => {
    let noDeps = true
    if (opts.argv.noDeps) {
      const names = list.map((r) => r.name)
      const deps = Object.keys(item?.pkg?.dependencies ?? {})
      noDeps = deps.every((d) => !names.includes(d))
    }

    let depsPrs = true
    if (opts.argv.depsPrs) {
      const currentDepsPrs = item.otherPrs.filter(
        (pr) =>
          pr.labels.find((l) => l.toLowerCase() === 'dependencies') &&
          !pr.title.startsWith('chore:')
      ).length
      depsPrs =
        opts.argv.depsPrs === 'none'
          ? currentDepsPrs === 0
          : currentDepsPrs !== 0
    }

    return noDeps && depsPrs
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
      depsPrs: {
        default: '',
        choices: ['', 'none', 'any'],
        type: 'string',
        desc: 'Only return items that have no open deps PRs',
      },
    })
  ),
}

export default baseQuery
