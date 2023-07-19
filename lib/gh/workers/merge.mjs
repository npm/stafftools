import { checkout, clone } from './_common.mjs'
import { OPEN_PR } from '../types.mjs'

export const type = OPEN_PR

export const filter = [
  'status: SUCCESS',
  { value: 'reviewDecision: REVIEW_REQUIRED', reject: true },
]

export const args = {
  desc: 'Merge pull requests',
  builder: (yargs) =>
    yargs.options({
      'merge-strategy': {
        demand: true,
        choices: ['squash', 'rebase'],
        desc: 'strategy to use when merging the pull request',
      },
      remote: {
        demand: true,
        default: 'origin',
        desc: 'name of the remote',
      },
      approve: {
        default: false,
        desc: 'whether to approve the pr',
        type: 'boolean',
      },
    }),
}

export const success = ({ item }) => item.url

export default [
  clone,
  () => ['git', ['fetch']],
  ({ item, argv }) =>
    argv.approve ? ['gh', ['pr', 'review', item.number, '--approve']] : null,
  ({ item, argv }) => [
    'gh',
    ['pr', 'merge', item.number, `--${argv.mergeStrategy}`],
  ],
  checkout,
  () => ['git', ['pull']],
]
