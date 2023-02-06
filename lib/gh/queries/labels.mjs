import { flow } from 'lodash-es'
import { LABEL } from '../types.mjs'
import baseQuery, * as base from './graphql.mjs'

export const type = LABEL

export const filter = [...base.filter]

export const args = {
  desc: 'Fetch pull requests',
  builder: flow(base.args.builder, (yargs) =>
    yargs.options({
      repos: {
        desc: 'query to filter repos',
        demand: true,
        type: 'string',
      },
      cache: {
        default: '1h',
      },
      query: {
        hidden: true,
        demand: true,
        default: 'labels',
      },
    })
  ),
}

export default flow(baseQuery, (res) => {
  const labels = new Map()

  res.forEach((repo) => {
    repo.labels.nodes.forEach((label) => {
      const labelRepo = {
        name: repo.name,
        nameWithOwner: repo.nameWithOwner,
        owner: repo.owner.login,
        color: label.color,
        id: label.id,
      }
      const labelId = label.name.toLowerCase()
      if (labels.has(labelId)) {
        labels.get(labelId).repos.push(labelRepo)
      } else {
        labels.set(labelId, {
          name: label.name,
          owner: '',
          id: label.id,
          repos: [labelRepo],
        })
      }
    })
  })

  return [...labels.values()]
})
