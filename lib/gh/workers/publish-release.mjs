import { checkout, clone, publish } from './_common.mjs'

export const type = 'pending-release'

export const filter = ['status: !FAILURE']

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
    }),
}

export const success = ({ item }) => item.url

export default [
  clone,
  () => ['git', ['fetch']],
  ({ item }) => ['gh', ['pr', 'merge', item.number, `--squash`]],
  checkout,
  () => ['git', ['pull']],
  publish,
]
