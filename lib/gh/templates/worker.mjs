import chalk from 'chalk'
import { WORKER } from '../types.mjs'

export const type = WORKER

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
        JSON.stringify(cmd.options),
        `Status: ${cmd.status}`,
        cmd.rawStatus !== cmd.status ? `Raw Status: ${cmd.rawStatus}` : null,
        cmd.output ? `Output: ${cmd.output}` : null,
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
  table: (rows) => rows.map(workerReport).join('\n\n'),
}
