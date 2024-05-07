import { REPO, WEEKLY_METRICS } from '../types.mjs'
import { safeJSONParse } from './_common.mjs'
import { apiOnlyOptions } from '../yargs/utils.mjs'
import { mapValues } from 'lodash-es'

export const type = REPO

export const filter = []

export const template = WEEKLY_METRICS

const ONE_DAY = 1000 * 60 * 60 * 24

export const args = {
  desc: 'Get weekly metrics',
  builder: (yargs) =>
    yargs.options({
      date: {
        demand: true,
        desc: 'the end date',
        default: '',
        coerce: (v) =>
          v
            ? Number(new Date(args.date)) + ONE_DAY
            : new Date(Date.now() - (Date.now() % ONE_DAY)),
      },
      ago: {
        demand: true,
        default: '7',
        desc: 'how many days back to go',
        coerce: (v) => ONE_DAY * v - ONE_DAY,
      },
      ...apiOnlyOptions(),
    }),
}

const setGhState = (name, dateKey, ghArgs) => [
  (o) => [
    'gh',
    ghArgs(o),
    {
      parse: (r) => safeJSONParse(r) ?? [],
      status: ({ status, stderr }) =>
        stderr.includes('repository has disabled issues') ? 0 : status,
    },
  ],
  ({ result, state, argv }) => {
    state[name] = result.output.filter((r) => {
      const delta = new Date(argv.date) - new Date(dateKey(r))
      return delta > 0 && delta < argv.ago
    })
  },
]

export default [
  ...setGhState(
    'mergedPrs',
    (r) => r.mergedAt,
    ({ item }) => [
      'pr',
      'list',
      `--repo='${item.nameWithOwner}'`,
      '--state',
      'merged',
      '--json',
      'mergedAt,isCrossRepository',
    ]
  ),
  ({ state }) => {
    state.externalPrs = state.mergedPrs.filter((r) => r.isCrossRepository)
  },
  // Ignoring bots makes the closed count wrong because it doesn't add back in merged bot PRs
  ...setGhState(
    'closedPrs',
    (r) => r.closedAt,
    ({ item }) => [
      'pr',
      'list',
      `--repo='${item.nameWithOwner}'`,
      '--state',
      'closed',
      '--json',
      'closedAt',
    ]
  ),
  ...setGhState(
    'closedIssues',
    (r) => r.closedAt,
    ({ item }) => [
      'issue',
      'list',
      `--repo='${item.nameWithOwner}'`,
      '--state',
      'closed',
      '--json',
      'closedAt',
    ]
  ),
  // We query all issues cause even closed ones may have been opened w/in this time window
  ...setGhState(
    'openedIssues',
    (r) => r.createdAt,
    ({ item }) => [
      'issue',
      'list',
      `--repo='${item.nameWithOwner}'`,
      '--json',
      'createdAt',
    ]
  ),
  ...setGhState(
    'releases',
    (r) => r.published_at,
    ({ item }) => ['api', `/repos/${item.nameWithOwner}/releases`]
  ),
  ({ state }) => [
    'echo',
    [`'${JSON.stringify(mapValues(state, (v) => v.length))}'`],
    { parse: (r) => safeJSONParse(r) ?? {}, message: () => 'echo' },
  ],
]
