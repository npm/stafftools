import { PR } from '../types.mjs'

export const type = PR

export const args = {
  desc: 'Remove a label from pull requests',
  builder: (yargs) =>
    yargs.options({
      'remove-label': {
        demand: true,
        type: 'string',
        desc: 'label to remove from pull requests',
      },
      limit: {
        default: 1,
        hidden: true,
      },
    }),
}

export const success = ({ item }) => item.url

// This command sets the repo and cwd explicitly since
// it doesn't require any cloning, it just makes api calls
export default [
  ({ item, argv }) => [
    'gh',
    [
      'pr',
      'edit',
      item.number,
      `--remove-label='${argv.removeLabel}'`,
      `--repo='${item.nameWithOwner}'`,
    ],
    { cwd: argv.cwd },
  ],
]
