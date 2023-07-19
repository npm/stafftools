import singleLineLog from 'single-line-log'
import readline from 'readline'
import { noop } from 'lodash-es'
import stringWidth from 'string-width'

const OUTPUT_STREAM = 'stderr'

const rowify = (str, toWidth) => {
  if (typeof toWidth !== 'number') {
    return str
  }
  const width = stringWidth(str.toString())
  return str + ' '.repeat(Math.max(0, toWidth - width))
}

export const columnify = (items, makeRow) => {
  const widths = []
  return items
    .map((row) => {
      row.cells = makeRow(row)
      row.cells.forEach((cell, index, list) => {
        if (index < list.length - 1) {
          // ignore last column since we dont need to set its width
          widths[index] = Math.max(widths[index] || 0, stringWidth(cell))
        }
      })
      return row
    })
    .map((row) => {
      row.display = row.cells
        .map((cell, index) => rowify(cell, widths[index]))
        .join(' '.repeat(2))
      return row
    })
}

export const tableify = (makeRow) => (items) =>
  columnify(items, makeRow)
    .map((r) => r.display)
    .join('\n')

export const paginate = ({ isRunning, index, rows, perPage }) => {
  if (rows.length > perPage) {
    const lastRunning = rows.findLastIndex(isRunning)
    if (lastRunning >= index + perPage) {
      index = rows.findIndex(isRunning)
    }
    rows = rows.slice(index, index + perPage)
  }
  return { rows, index }
}

const cleaner = (args) =>
  args.map((a) =>
    typeof a === 'string'
      ? a.replace(/\b(npm|ghp)_[a-zA-Z0-9]{36}\b/g, '$1_*****')
      : a
  )

const cleanWrapper = (obj) => {
  const wrapped = Object.entries(obj).map(([k, v]) => [
    k,
    (...args) => v(...cleaner(args)),
  ])
  return Object.fromEntries(wrapped)
}

export const createDisplay = ({ debug, progress, totalRows }) => {
  // eslint-disable-next-line no-console
  const consoleError = console.error

  // eslint-disable-next-line no-console
  const consoleLog = console.log

  // eslint-disable-next-line no-console
  const consoleWarn = console.warn

  // https://gist.github.com/timneutkens/f2933558b8739bbf09104fb27c5c9664
  const clearScreenDown = () => {
    const blank = '\n'.repeat(totalRows)
    consoleError(blank)
    readline.cursorTo(process[OUTPUT_STREAM], 0, 0)
    readline.clearScreenDown(process[OUTPUT_STREAM])
  }

  return cleanWrapper({
    output: consoleLog,
    outputError: consoleError,
    // for logging debug output only
    debug: debug.log ? consoleError : noop,
    warn: consoleWarn,
    // when debugging or not doing progress just log to stderr
    // otherwise do a single line log to replace other contents
    log: progress ? singleLineLog[OUTPUT_STREAM] : consoleError,
    // logging progress does nothing if debugging or progress if off
    // otherwise it will log or clear if called with nothing
    progress: progress ? singleLineLog[OUTPUT_STREAM] : noop,
    // moves all current output on the terminal off the screen
    clear: progress ? clearScreenDown : noop,
  })
}
