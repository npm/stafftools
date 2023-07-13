import { OPEN_PR } from '../types.mjs'
import { apiOnlyOptions } from '../yargs/utils.mjs'

export const type = OPEN_PR

export const filter = []

export const args = {
  desc: 'Get engine changes in a pull request',
  builder: (yargs) =>
    yargs.options({
      ...apiOnlyOptions(),
    }),
}

const getEngines = ({ output }) => {
  const { content } = JSON.parse(output)
  const buff = Buffer.from(content, 'base64').toString('utf-8')
  return JSON.parse(buff)?.engines?.node
}

export const success = ({ results: [base, head], item }) => {
  const baseNode = getEngines(base)
  const headNode = getEngines(head)
  const engines =
    baseNode === headNode ? 'NO CHANGE' : `${baseNode} --> ${headNode}`
  return `${item.commitMessage.split(':')[0]} ${engines}`
}

export default [
  ({ item }) => [
    'gh',
    [
      'api',
      `/repos/${item.owner}/${item.name}/contents/package.json?ref=${item.baseRef}`,
    ],
  ],
  ({ item }) => [
    'gh',
    [
      'api',
      `/repos/${item.owner}/${item.name}/contents/package.json?ref=${item.headRef}`,
    ],
  ],
]
