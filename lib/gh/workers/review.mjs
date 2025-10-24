import { OPEN_PR } from '../types.mjs'
import { apiOnlyOptions } from '../yargs/utils.mjs'

export const type = OPEN_PR

export const args = {
  desc: 'Review pull requests',
  builder: (yargs) =>
    yargs.options({
      approve: {
        default: false,
        desc: 'whether to approve the pr',
        type: 'boolean',
      },
      requireSuccess: {
        default: true,
        desc: 'only review PRs with successful CI status',
        type: 'boolean',
      },
      ...apiOnlyOptions(),
    }),
  filter: (argv) => {
    const filters = ['reviewDecision: REVIEW_REQUIRED']
    if (argv.requireSuccess) {
      filters.push('status: SUCCESS')
    }
    return filters
  },
}

export const success = ({ item }) => item.url

export default [
  ({ item, argv }) => [
    'gh',
    [
      'pr',
      'review',
      item.number,
      `--repo='${item.nameWithOwner}'`,
      `${argv.approve ? '--approve' : ''}`,
    ],
  ],
]
