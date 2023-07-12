import { OPEN_PR } from '../types.mjs'

export const type = OPEN_PR

export const filter = ['status: SUCCESS']

export const args = {
  desc: 'Review pull requests',
  builder: (yargs) =>
    yargs.options({
      approve: {
        default: false,
        desc: 'whether to approve the pr',
        type: 'boolean',
      },
      limit: {
        default: 1,
        hidden: true,
      },
    }),
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
