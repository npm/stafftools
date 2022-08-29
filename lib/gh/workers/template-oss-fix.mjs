import { clone, commit } from './_common.mjs'
import { defaultFilter } from '../yargs/utils.mjs'

export const type = 'template-oss'

export const args = {
  desc: 'Fix failing template-oss pull requests',
  builder: (yargs) =>
    yargs.options({
      message: {
        demand: true,
        default: 'chore: postinstall for dependabot template-oss PR',
        desc: 'Commit message to be used for template oss changes',
      },
      ...defaultFilter({
        default: `title: '@npmcli/template-oss', status: /FAILURE|null/`,
      }),
    }),
}

export const success = ({ item }) => item.url

export default [
  clone,
  () => ['git', ['fetch']],
  ({ item }) => ['gh', ['pr', 'checkout', item.number]],
  () => ['npm', ['install']],
  () => ['npm', ['install', '@npmcli/template-oss@latest', '--save-exact']],
  () => ['npm', ['run', 'template-oss-apply']],
  () => ['npm', ['run', 'lint']],
  () => ['git', ['add', '.']],
  commit,
  () => ['git', ['push']],
]
