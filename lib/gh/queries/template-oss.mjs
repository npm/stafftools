import { flow } from 'lodash-es'
import baseQuery, * as base from './dependabot.mjs'
import { defaultFilter } from '../yargs/utils.mjs'

export const type = base.type

export const args = {
  desc: 'Fetch template-oss pull requests',
  builder: flow(base.args.builder, (yargs) =>
    yargs.options({
      ...defaultFilter({
        default: `title: '@npmcli/template-oss'`,
      }),
    })
  ),
}

export default baseQuery
