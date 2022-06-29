import { checkout, clone } from './_common.mjs'
import { REPO } from '../types.mjs'

export const type = REPO

export const args = {
  desc: 'Clone all matching repos into a directory ',
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
  () => ['git', 'fetch'],
  checkout,
  () => ['gh', 'repo', 'sync'],
]
