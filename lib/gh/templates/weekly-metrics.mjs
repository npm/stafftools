import { WEEKLY_METRICS } from '../types.mjs'

export const type = WEEKLY_METRICS

export const def = 'report'

const display = {
  prs: (merged, external, closed) =>
    `PRs: ${merged} merged (${external} external), ${closed} closed`,
  issues: (opened, closed) => `Issues: ${opened} opened, ${closed} closed`,
  releases: (releases) => `${releases} release${releases === 1 ? '' : 's'}`,
  date: (d) => new Date(d).toDateString(),
}

export default {
  report: (rows, { date, ago }) => {
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
          return (
            [
              row.id,
              releases ? display.releases(releases) : '',
              mergedPrs || closedPrs
                ? display.prs(mergedPrs, externalPrs, closedPrs)
                : '',
              closedIssues || openedIssues
                ? display.issues(openedIssues, closedIssues)
                : '',
            ]
              .filter(Boolean)
              .join('\n') + '\n'
          )
        }
      })
      .filter(Boolean)

    return [
      ...repoDisplay,
      `npm-cli activity from ${display.date(date - ago)} to ${display.date(
        date
      )}`,
      `${rows.length} active repo${rows.length === 1 ? '' : 's'}`,
      display.releases(releasesTotal),
      display.prs(mergedPrsTotal, externalPrsTotal, closedPrsTotal),
      display.issues(openedIssuesTotal, closedIssuesTotal),
    ].join('\n')
  },
}
