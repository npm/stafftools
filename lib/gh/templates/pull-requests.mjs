import chalk from 'chalk'
import { tableify } from '../render/utils.mjs'
import { PR } from '../types.mjs'

export const type = PR

export const def = 'table'

const getState = (status) =>
  status === 'SUCCESS'
    ? { color: 'green', symbol: '✅' }
    : status === 'FAILURE'
    ? { color: 'red', symbol: '❌' }
    : status === 'PENDING'
    ? { color: 'yellow', symbol: '🔄' }
    : { color: 'reset', symbol: '?' }

export default {
  table: tableify(({ status, nameWithOwner, title, url, number }) => {
    const state = getState(status)
    return [
      state.symbol,
      chalk[state.color](`#${number}`),
      nameWithOwner,
      title,
      url,
    ]
  }),
  confirm: tableify(({ status, nameWithOwner, title }) => {
    const state = getState(status)
    return [state.symbol, nameWithOwner, title]
  }),
}
