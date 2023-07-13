import { OPEN_PR } from '../types.mjs'
import { apiOnlyOptions } from '../yargs/utils.mjs'

export const type = OPEN_PR

export const filter = []

export const args = {
  desc: 'Get engine changes in a pull request',
  builder: (yargs) =>
    yargs.options({
      workflow: {
        demand: true,
        default: 'CI',
        desc: 'Name of the workflow to rerun',
      },
      ...apiOnlyOptions(),
    }),
}

export const success = ({ item }) => item.url

export default [
  ({ item, argv }) => [
    'gh',
    [
      'run',
      'list',
      `--repo='${item.nameWithOwner}'`,
      '--branch',
      item.headRef,
      '--workflow',
      `"${argv.workflow}"`,
      '--limit',
      '1',
      '--json',
      'databaseId,conclusion',
    ],
  ],
  ({ item, result }) => {
    const { databaseId, conclusion } = JSON.parse(result.output)?.[0] || {}
    if (databaseId && conclusion === 'failure') {
      return [
        'gh',
        [
          'run',
          'rerun',
          databaseId,
          `--repo='${item.nameWithOwner}'`,
          '--failed',
        ],
      ]
    }
  },
]
