import { OPEN_PR } from '../types.mjs'
import { apiOnlyOptions } from '../yargs/utils.mjs'

export const type = OPEN_PR

export const filter = [
  { value: 'status: SUCCESS', reject: true },
  { value: 'status: FAILURE', reject: true },
]

export const args = {
  desc: 'Trigger CI workflows for pull requests by closing and reopening them',
  builder: (yargs) =>
    yargs
      .options({
        ...apiOnlyOptions(),
      })
      .example(
        'npx -p @npmcli/stafftools@latest gh template-oss trigger-ci',
        'Trigger CI for template-oss PRs without definitive status (excludes SUCCESS and FAILURE by default)'
      ),
}

export const success = ({ item }) => item.url

export default [
  ({ item }) => [
    'gh',
    [
      'pr',
      'close',
      item.number,
      `--repo=${item.nameWithOwner}`,
    ],
  ],
  ({ item }) => [
    'gh',
    [
      'pr',
      'reopen',
      item.number,
      `--repo=${item.nameWithOwner}`,
    ],
  ],
]
