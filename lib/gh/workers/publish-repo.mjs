import { flow } from 'lodash-es'
import { publish } from './_common.mjs'
import * as pull from './pull.mjs'

export const type = pull.type

export const args = {
  desc: 'Publish repos from their default branch',
  builder: flow(pull.args.builder, (yargs) =>
    yargs.options({
      otp: {
        demand: true,
        type: 'string',
        desc: 'otp to be used for publish',
      },
    })
  ),
}

export default [...pull.default, publish]
