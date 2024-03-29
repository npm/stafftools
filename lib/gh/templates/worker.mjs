import chalk from 'chalk'
import { WORKER } from '../types.mjs'

export const type = WORKER

export const def = 'report'

const stringify = (v) =>
  typeof v === 'string' ? v : JSON.stringify(v, null, 2)

const colorCode = (code) =>
  code ? { color: 'red', symbol: '❌' } : { color: 'green', symbol: '✅' }

const workerReport = ({ result, ...row }) => {
  const state = colorCode(result.code)
  const title = chalk[state.color](
    ['='.repeat(80), `${state.symbol} ${row.id}`, '='.repeat(80)].join('\n')
  )
  const error = result.error
    ? [
        chalk.red('Error:'),
        chalk.red('-'.repeat(80)),
        result.error.stack.replace(/^Error: /, ''),
        result.error.output ? `Output: ${result.error.output}` : null,
        chalk.red('-'.repeat(80)),
        '',
      ]
    : []

  const commands = result.commands
    .map((cmd) => {
      const cmdState = colorCode(cmd.status)
      return [
        chalk[cmdState.color](`${cmdState.symbol} ${cmd.command}`),
        `Options: ${JSON.stringify(cmd.options)}`,
        `Status: ${cmd.status}`,
        cmd.rawStatus !== cmd.status ? `Raw Status: ${cmd.rawStatus}` : null,
        cmd.output ? `Output: ${stringify(cmd.output)}` : null,
      ]
        .filter((v) => v != null)
        .join('\n')
    })
    .join(`\n${'-'.repeat(80)}\n`)

  return [
    title,
    '',
    ...error,
    'Commands:',
    '-'.repeat(80),
    commands,
    '-'.repeat(80),
  ]
    .filter((v) => v != null)
    .join('\n')
}

export default {
  report: (rows) => {
    const [failure, success] = rows.reduce(
      (acc, item) => {
        acc[item.result.code ? 0 : 1].push(item)
        return acc
      },
      [[], []]
    )
    return [...success, ...failure].map(workerReport).join('\n\n')
  },
}
