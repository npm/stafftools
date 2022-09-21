import { flow } from 'lodash-es'
import { OPEN_PR } from '../types.mjs'
import baseQuery, * as base from './pull-requests.mjs'

export const type = OPEN_PR

export const filter = [...base.filter]

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
        default: 'OPEN',
      },
    })
  ),
}

export default baseQuery
