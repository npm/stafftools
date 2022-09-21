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
    }),
}

export default [
  clone,
  () => ['git', ['fetch']],
  checkout,
  // Setting the source property makes it work for ours repos that are
  // forks of others. But we want git remotes setup so ours is the source
  ({ item }) => ['gh', ['repo', 'sync', '--source', item.nameWithOwner]],
]
