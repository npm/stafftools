import { debounce, startCase, groupBy } from 'lodash-es'
import chalk from 'chalk'
import { statuses } from '../worker/main.mjs'
import * as utils from './utils.mjs'

const createRender = ({ debug, progress, idKey, rows: totalRows }) => {
  let state = null

  const display = utils.createDisplay({ debug, progress, totalRows })

  const init = (items) => {
    display.clear()

    const defaultData = {
      status: statuses.WAITING,
    }

    const dataByKey = items.reduce((acc, item) => {
      acc[item[idKey]] = {}
      return acc
    }, {})

    state = {
      done: false,
      index: 0,
      set: (item, itemData) => Object.assign(dataByKey[item[idKey]], itemData),
      setAll: (newData) => Object.assign(defaultData, newData),
      get counts() {
        const counts = {
          ...groupBy(this.items, 'status'),
          total: this.items,
        }
        return ['total', ...Object.keys(statuses)].map((k) => [
          k,
          counts[k]?.length ?? 0,
        ])
      },
      get items() {
        return items.map((item, index) => ({
          index: (index + 1).toString(),
          ...item,
          ...defaultData,
          ...dataByKey[item[idKey]],
        }))
      },
    }

    return items
  }

  const render = () => {
    const rows = utils.columnify(
      state.items,
      ({ index, [idKey]: id, code, step, total, message }) => [
        index,
        chalk[code == null ? 'reset' : code === 0 ? 'green' : 'red'](id),
        `${step ?? 0}/${total ?? '?'}`,
        message?.split('\n')[0] ?? '...',
      ]
    )

    const title = state.counts
      .map(([k, v]) => `${startCase(k.toLowerCase())}: ${v}`)
      .join(' - ')

    const paginated = utils.paginate({
      rows,
      perPage: totalRows - 1,
      index: state.index,
      isRunning: (item) => item.status === statuses.RUNNING,
    })

    state.index = paginated.index

    display.progress(
      [title, ...paginated.rows.map((r) => r.display)].join('\n')
    )
  }

  const rerender = debounce(
    () => {
      if (!state.done) {
        render()
      }
    },
    16,
    { maxWait: 32 }
  )

  return {
    ...display,
    init,
    done: () => {
      state.done = true // stop all future debounced renders
      render() // flush final state to terminal
      // clear progress ouput and scroll screen
      // to prepare for final output to be written
      // when in progress mode
      display.clear()
    },
    update: (...args) => {
      if (args.length === 2) {
        state.set(...args)
      } else {
        state.setAll(...args)
      }
      rerender()
    },
  }
}

export default createRender
