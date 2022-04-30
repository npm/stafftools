import { checkout, clone } from './_common.mjs'
import { defaultFilter } from '../yargs/utils.mjs'
import { PR } from '../types.mjs'

export const type = PR

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
      ...defaultFilter({
        default: 'status: SUCCESS',
      }),
    }),
}

export const success = ({ item }) => item.url

export default [
  clone,
  () => ['git', 'fetch'],
  ({ item, argv }) => [
    'gh',
    'pr',
    'merge',
    item.number,
    `--${argv.mergeStrategy}`,
  ],
  checkout,
  () => ['git', 'pull'],
]
