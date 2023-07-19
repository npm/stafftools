import { OPEN_PR } from '../types.mjs'
import { apiOnlyOptions } from '../yargs/utils.mjs'
import { getRemotePkg } from './_common.mjs'

export const type = OPEN_PR

export const filter = []

export const args = {
  desc: 'Get engine changes in a pull request',
  builder: (yargs) =>
    yargs.options({
      ...apiOnlyOptions(),
    }),
}

export const success = ({ results: [base, head], item }) => {
  const baseNode = base?.engines?.node
  const headNode = head?.engines?.node
  const engines =
    baseNode === headNode ? 'NO CHANGE' : `${baseNode} --> ${headNode}`
  return `${item.commitMessage.split(':')[0]} ${engines}`
}

export default [
  ({ item }) => getRemotePkg({ item, ref: item.baseRef }),
  ({ item }) => getRemotePkg({ item, ref: item.headRef }),
]
