import { checkout, clone } from './_common.mjs'
import { defaultFilter } from '../yargs/utils.mjs'

export const type = 'pending-release'

export const args = {
  desc: 'Merge pending release PRs and publish the resulting release',
  builder: (yargs) =>
    yargs.options({
      otp: {
        demand: true,
        type: 'string',
        desc: 'otp to be used for publish',
      },
      remote: {
        demand: true,
        default: 'origin',
        desc: 'name of the remote',
      },
      ...defaultFilter({
        default: 'status: !FAILURE',
      }),
    }),
}

export const success = ({ item }) => item.url

export default [
  clone,
  () => ['git', 'fetch'],
  ({ item }) => ['gh', 'pr', 'merge', item.number, `--squash`],
  checkout,
  () => ['git', 'pull'],
  ({ argv }) => ['npm', 'publish', `--otp=${argv.otp}`],
]
