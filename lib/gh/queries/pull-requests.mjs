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
    })
  ),
}

export default flow(baseQuery, (res) =>
  res.flatMap((repo) => {
    const mapPr = (pr) => ({
      ...omit(pr, 'commits'),
      id: repo.nameWithOwner + '#' + pr.number,
      labels: pr.labels?.nodes.map((l) => l.name),
      status: pr.commits?.nodes[0]?.commit.statusCheckRollup?.state ?? null,
      commitMessage: pr.commits?.nodes[0]?.commit?.message ?? null,
      commitAuthor: pr.commits?.nodes[0]?.commit?.author?.user?.login ?? null,
      author: pr.author?.user?.login ?? null,
      baseRef: pr.baseRefName,
      headRef: pr.headRefName,
    })
    return repo.pullRequests.nodes.map((pr) => {
      return {
        ...omit(repo, 'pullRequests'),
        pkg: JSON.parse(repo.pkg?.text || 'null'),
        owner: repo.owner.login,
        ...mapPr(pr),
        otherPrs: repo.allPrs.nodes
          .filter((otherPr) => otherPr.number !== pr.number)
          .map(mapPr),
      }
    })
  })
)
