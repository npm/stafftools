import { checkout, clone, publish, op } from './_common.mjs'

export const type = 'pending-release'

export const filter = [{ value: 'status: FAILURE', reject: true }]

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

// If we are using the special 1password cli to get our totp
// then we can call it once before to prime the auth with
// touchid, etc so that it doesn't need auth for all the
// initial threads
export const before = [op]

export default [
  clone,
  () => ['git', ['fetch']],
  ({ item }) => ['gh', ['pr', 'merge', item.number, `--squash`]],
  checkout,
  () => ['git', ['pull']],
  publish,
]
