import { OPEN_PR } from '../types.mjs'
import { apiOnlyOptions } from '../yargs/utils.mjs'

export const type = OPEN_PR

export const filter = []

export const args = {
  desc: 'Comment on pull requests',
  builder: (yargs) =>
    yargs.options({
      body: {
        default: false,
        desc: 'the body to post',
        type: 'string',
      },
      ...apiOnlyOptions(),
    }),
}

export const success = ({ item }) => item.url

export default [
  ({ item, argv }) => [
    'gh',
    [
      'pr',
      'comment',
      item.number,
      `--repo='${item.nameWithOwner}'`,
      '--body',
      `'${argv.body}'`,
    ],
  ],
]
