import { REPO } from '../types.mjs'
import { checkout, clone } from './_common.mjs'

export const type = REPO

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
  () => ['gh', ['repo', 'sync']],
]
