// import chalk from 'chalk'
import { tableify } from '../render/utils.mjs'
import { LABEL } from '../types.mjs'

export const type = LABEL

export const def = 'table'

export default {
  table: tableify((row) => {
    return [row.name, row.repos.length]
  }),
  markdown: (rows) => {
    const tableRows = rows
      .sort((a, b) => b.repos.length - a.repos.length)
      .map((row) => {
        const colors = row.repos.reduce((acc, repo) => {
          if (!acc[repo.color]) {
            acc[repo.color] = 1
          } else {
            acc[repo.color] += 1
          }
          return acc
        }, {})
        const mostCommon = Object.entries(colors).sort(
          (a, b) => b[1] - a[1]
        )[0][0]
        return [
          `![${row.name}](https://img.shields.io/badge/-${encodeURIComponent(
            row.name
          ).replace(/-/g, '--')}-${mostCommon})`,
          `\`#${mostCommon}\``,
          row.repos.length,
        ]
      })
      .map((r) => `|${r.join('|')}|`)
      .join('\n')

    return `|Label|Color|Repo Count|\n|---|---|---|\n${tableRows}`
  },
  confirm: tableify((repo) => [`${repo.owner}/${repo.name}`]),
}
