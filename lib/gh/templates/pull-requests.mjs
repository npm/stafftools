import chalk from 'chalk'
import { tableify } from '../render/utils.mjs'
import { PR } from '../types.mjs'

export const type = PR

export default {
  table: tableify(({ status, nameWithOwner, title, url, number }) => {
    const state =
      status === 'SUCCESS'
        ? { color: 'green', symbol: '✅' }
        : status === 'FAILURE'
        ? { color: 'red', symbol: '❌' }
        : status === 'PENDING'
        ? { color: 'yellow', symbol: '🔄' }
        : { color: 'reset', symbol: '?' }
    return [
      state.symbol,
      chalk[state.color](`#${number}`),
      nameWithOwner,
      title,
      url,
    ]
  }),
}
