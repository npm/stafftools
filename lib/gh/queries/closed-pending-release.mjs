import { flow } from 'lodash-es'
import { CLOSED_PR } from '../types.mjs'
import baseQuery, * as base from './pending-release.mjs'

export const type = CLOSED_PR

export const args = {
  desc: 'Fetch closed pending release pull requests',
  builder: flow(base.args.builder, (yargs) =>
    yargs.options({
      state: {
        hidden: true,
        default: 'CLOSED',
      },
    })
  ),
}

export default baseQuery
