'use strict'
const assert = require('node:assert')

// Add to this to skip certain repos that shouldn't be tracked
const IGNORED_REPOS = ['node', 'release-please', 'npm-cli-release-please', 'publish-test']

const { spawnSync } = require('node:child_process')
const ghSpawn = (args) => {
  const result = spawnSync('gh', args, { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  return result.stdout.split('\n').filter(Boolean)
}

const { values:args } = require('node:util').parseArgs({
  options: {
    date: { // End date!
      type: 'string',
      short: 'd',
    },
    ago: { // How far back to go
      type: 'string',
      short: 'a',
      default: '7'
    },
    repo: { // Repo without "npm/"
      type: 'string',
      short: 'r',
    }
  }
})

const oneDay = 1000 * 60 * 60 * 24
// Defaults to yesterday, going back one week.
// This is usually ran on Friday
let now = new Date(Date.now() - (Date.now() % (oneDay)))
if (args.date) {
  now = Number(new Date(args.date)) + oneDay
}
const ago = oneDay * args.ago - oneDay

// Was in the past but is not in the future
const goodDate = d => {
  const delta = now - new Date(d)
  const good = (0 < delta) && (delta < ago)
  return good
}

const listReposQuery = `
query {
  search (query:"org:npm topic:npm-cli fork:true archived:false", type:REPOSITORY, first:100) {
    nodes {
      ... on Repository {
        name
      }
    }
  }
}
`

const main = async () => {

  console.log(`querying from ${new Date(now - ago).toDateString()} to ${new Date(now).toDateString()}`)
  let releasesTotal = 0
  let mergedPrsTotal = 0
  let externalPrsTotal = 0
  let closedPrsTotal = 0
  let closedIssuesTotal = 0
  let openedIssuesTotal = 0

  let repos
  if (!args.repo) {
    repos = ghSpawn(['api', '/graphql', '-f', `query=${listReposQuery}`, '--jq', '.data.search.nodes[].name'])
    .filter(r => !IGNORED_REPOS.includes(r))
  } else {
    let repo = args.repo
    if (repo.startsWith('npm/')) {
      repo = repo.split('/').pop()
    }
    repos = [repo]
  }

  for (const repo of repos) {
    let display
    let mergedPrsCount = 0
    let externalPrsCount = 0
    let closedPrsCount = 0
    let closedIssuesCount = 0
    let openedIssuesCount = 0
    let releasesCount = 0

    const mergedPrs = ghSpawn(['pr', 'list', '-R', `npm/${repo}`, '--state', 'merged', '--json', 'mergedAt,isCrossRepository', '--jq', '.[] | {mergedAt,isCrossRepository} | join(" ")'])
      .map(p => p.split(' '))
      .filter(([, d]) => goodDate(d))

    mergedPrsCount += mergedPrs.length
    mergedPrsTotal += mergedPrs.length

    closedPrsCount -= mergedPrs.length
    closedPrsTotal -= mergedPrs.length

    display = !!mergedPrs.length

    const externalPrs = mergedPrs.filter(([e]) => e === 'true')

    externalPrsCount += externalPrs.length
    externalPrsTotal += externalPrs.length

    const closedPrs = ghSpawn(['pr', 'list', '-R', `npm/${repo}`, '--state', 'closed', '--json', 'closedAt,author', '--jq', '.[] | {closedAt, bot: .author.is_bot} | join(" ")'])
      .map(p => p.split(' '))
      // Ignoring bots makes the closed count wrong because it doesn't add back in merged bot PRs
      // .filter(([b, d]) => (goodDate(d) && b !== 'false'))
      .filter(([b, d]) => goodDate(d))

    closedPrsCount += closedPrs.length
    closedPrsTotal += closedPrs.length

    try {
      const closedIssues = ghSpawn(['issue', 'list', '-R', `npm/${repo}`, '--state', 'closed', '--json', 'closedAt', '--jq', '.[].closedAt'])
        .filter(goodDate)


      closedIssuesCount += closedIssues.length
      closedIssuesTotal += closedIssues.length
      display = display || !!closedIssues.length

      // We query all issues cause even closed ones may have been opened w/in this time window
      const openedIssues = ghSpawn(['issue', 'list', '-R', `npm/${repo}`, '--json', 'createdAt', '--jq', '.[].createdAt'])
        .filter(d => goodDate(d))

      openedIssuesCount += openedIssues.length
      openedIssuesTotal += openedIssues.length

      display = display || !!openedIssues.length

    } catch (err) {
    // some repos have issues disabled and that is ok
    }
    const releases = ghSpawn(['api', `/repos/npm/${repo}/releases`, '--jq', '.[].published_at'])
      .filter(goodDate)

    releasesCount += releases.length
    releasesTotal += releases.length

    display = display || !!releases.length

    if (display) {
      console.group(`npm/${repo}`)
      if (releasesCount) {
        console.log(`${releasesCount} release${releasesCount > 1 ? 's' : ''}`)
      }
      if (mergedPrsCount || closedPrsCount) {
        console.log(`PRs: ${mergedPrsCount} merged (${externalPrsCount} external), ${closedPrsCount} closed`)
      }
      if (closedIssuesCount || openedIssuesCount) {
        console.log(`Issues: ${openedIssuesCount} opened, ${closedIssuesCount} closed`)
      }
      console.groupEnd()
    }
  }

  console.log(`npm-cli activity from ${new Date(now - ago).toDateString()} to ${new Date(now).toDateString()}`)
  console.log(`${repos.length} active repo${repos.length > 1 ? 's' : ''}`)
  console.log(`${releasesTotal} release${releasesTotal > 1 ? 's' : ''}`)
  console.log(`PRs: ${mergedPrsTotal} merged (${externalPrsTotal} external), ${closedPrsTotal} closed`)
  console.log(`Issues: ${openedIssuesTotal} opened, ${closedIssuesTotal} closed`)
}

main()
