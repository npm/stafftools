import { REPO } from '../types.mjs'
import { checkout, clone } from './_common.mjs'

export const type = REPO

export const filter = []

export const args = {
  desc: 'Clone repos into a directory',
  builder: (yargs) =>
    yargs.options({
      remote: {
        demand: true,
        default: 'origin',
        desc: 'name of the remote',
      },
      force: {
        default: false,
        desc: 'force sync the repo, this will overwrite any local changes!',
        type: 'boolean',
      },
      sync: {
        default: true,
        desc: 'whether to sync the repo',
        type: 'boolean',
      },
    }),
}

export default [
  clone,
  () => ['git', ['fetch']],
  checkout,
  ({ argv }) => argv.force && ['git', ['checkout', '.']],
  ({ argv }) => argv.force && ['git', ['clean', '-fdx']],
  ({ item, argv }) =>
    argv.sync && [
      'gh',
      [
        'repo',
        'sync',
        argv.force ? '--force' : '',
        // Setting the source property makes it work for ours repos that are
        // forks of others. But we want git remotes setup so ours is the source
        '--source',
        item.nameWithOwner,
      ],
    ],
]
