import { flow } from 'lodash-es'
import { REPO } from '../types.mjs'
import baseQuery, * as base from './graphql.mjs'

export const type = REPO

export const args = {
  desc: 'Fetch repos',
  builder: flow(base.args.builder, (yargs) =>
    yargs.options({
      repos: {
        desc: 'query to filter repos',
        demand: true,
        type: 'string',
      },
      first: {
        desc: 'how many repos to return',
        demand: true,
        default: 100,
        type: 'number',
        hidden: true,
      },
      cache: {
        default: '1h',
      },
      query: {
        hidden: true,
        demand: true,
        default: 'repos',
      },
    })
  ),
}

export default flow(baseQuery, (res) =>
  res.map((repo) => ({
    ...repo,
    id: repo.nameWithOwner,
    owner: repo.owner.login,
    pkg: JSON.parse(repo.pkg?.text || 'null'),
  }))
)
