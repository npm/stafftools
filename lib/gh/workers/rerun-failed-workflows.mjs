import { OPEN_PR } from '../types.mjs'
import { apiOnlyOptions } from '../yargs/utils.mjs'
import { safeJSONParse } from './_common.mjs'

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
    { parse: (r) => safeJSONParse(r)[0] ?? {} },
  ],
  ({ item, result }) => {
    const { databaseId, conclusion } = result.output
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
