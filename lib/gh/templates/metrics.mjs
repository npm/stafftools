import { WEEKLY_METRICS } from '../types.mjs'
import { formatDate } from '../render/utils.mjs'

export const type = WEEKLY_METRICS

export const def = 'report'

const display = {
  prs: (merged, external, closed) =>
    `PRs: ${merged} merged (${external} external), ${closed} closed`,
  issues: (opened, closed) => `Issues: ${opened} opened, ${closed} closed`,
  releases: (releases) => `${releases} release${releases === 1 ? '' : 's'}`,
}

export default {
  report: (rows, { date, ago, ...argv }) => {
    let mergedPrsTotal = 0
    let externalPrsTotal = 0
    let releasesTotal = 0
    let closedIssuesTotal = 0
    let openedIssuesTotal = 0
    let closedPrsTotal = 0

    const repoDisplay = rows
      .map((row) => {
        const {
          mergedPrs,
          externalPrs,
          releases,
          closedIssues,
          openedIssues,
          closedPrs: _closedPrs,
        } = row.result.commands.at(-1).output

        mergedPrsTotal += mergedPrs
        externalPrsTotal += externalPrs
        releasesTotal += releases
        closedIssuesTotal += closedIssues
        openedIssuesTotal += openedIssues
        const closedPrs = _closedPrs - mergedPrs
        closedPrsTotal += closedPrs

        if (mergedPrs || releases || closedIssues || openedIssues) {
          const repo = [row.id]
          if (releases) {
            repo.push(display.releases(releases))
          }
          if (mergedPrs || closedPrs) {
            repo.push(display.prs(mergedPrs, externalPrs, closedPrs))
          }
          if (closedIssues || openedIssues) {
            repo.push(display.issues(openedIssues, closedIssues))
          }
          return repo.map((v, i) => (i === 0 ? v : `  ${v}`)).join('\n')
        }
      })
      .filter(Boolean)

    const end = new Date(date)
    const start = new Date(end.getTime() - ago)
    return [
      ...repoDisplay,
      `${argv.repos} activity from ${formatDate(start)} to ${formatDate(end)}`,
      `${rows.length} active repo${rows.length === 1 ? '' : 's'}`,
      display.releases(releasesTotal),
      display.prs(mergedPrsTotal, externalPrsTotal, closedPrsTotal),
      display.issues(openedIssuesTotal, closedIssuesTotal),
    ].join('\n')
  },
}
