import { OPEN_PR } from '../types.mjs'

export const type = OPEN_PR

export const filter = []

export const args = {
  desc: 'Get engine changes in a pull request',
  builder: (yargs) =>
    yargs.options({
      limit: {
        default: 1,
        hidden: true,
      },
      workflow: {
        demand: true,
        default: 'CI',
        desc: 'Name of the workflow to rerun',
      },
    }),
}

export const success = ({ item }) => item.url

export default [
  ({ item, argv }) => [
    'gh',
    [
      'run',
      'list',
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
  ({ result }) => {
    const { databaseId, conclusion } = JSON.parse(result.output)?.[0] || {}
    if (databaseId && conclusion === 'failure') {
      return ['gh', ['run', 'rerun', databaseId, '--failed']]
    }
  },
]
