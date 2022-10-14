import { omit, flow } from 'lodash-es'
import { PR } from '../types.mjs'
import baseQuery, * as base from './graphql.mjs'

export const type = PR

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
      label: {
        desc: 'label to filter pull requests',
        type: 'string',
        coerce: (v) => [v],
      },
      state: {
        desc: 'state to filter pull requests',
        default: 'OPEN',
        type: 'string',
        choices: ['CLOSED', 'MERGED', 'OPEN'],
        coerce: (v) => [v],
      },
      query: {
        hidden: true,
        demand: true,
        default: 'pull-requests',
      },
      'first-repos': {
        desc: 'how many repos to look for pull requests in',
        demand: true,
        default: 100,
        type: 'number',
        hidden: true,
      },
      'first-prs': {
        desc: 'how many prs to look for',
        demand: true,
        default: 100,
        type: 'number',
        hidden: true,
      },
    })
  ),
}

export default flow(baseQuery, (res) =>
  res.flatMap((repo) =>
    repo.pullRequests.nodes.map((pr) => ({
      ...omit(repo, 'pullRequests'),
      pkg: JSON.parse(repo.pkg?.text || 'null'),
      ...omit(pr, 'commits'),
      id: repo.nameWithOwner + '#' + pr.number,
      owner: repo.owner.login,
      status: pr.commits.nodes[0]?.commit.statusCheckRollup?.state ?? null,
      commitMessage: pr.commits.nodes[0]?.commit.message ?? null,
      baseRef: pr.baseRefName,
      headRef: pr.headRefName,
    }))
  )
)
