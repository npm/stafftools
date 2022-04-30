import { flow } from 'lodash-es'
import baseQuery, * as base from './pull-requests.mjs'

export const type = base.type

export const args = {
  desc: 'Fetch pending release pull requests',
  builder: flow(base.args.builder, (yargs) =>
    yargs.options({
      label: {
        default: 'autorelease: pending',
        hidden: true,
      },
      state: {
        hidden: true,
      },
    })
  ),
}

export default baseQuery
