import RJSON from 'relaxed-json'
import { isMatchWith, isRegExp, identity } from 'lodash-es'
import deepMapValues from 'just-deep-map-values'

const deepMapStrings = (item) =>
  JSON.parse(
    JSON.stringify(
      deepMapValues(item, (value) => {
        if (
          value === null ||
          ['string', 'number', 'boolean'].includes(typeof value)
        ) {
          return (value + '').trim()
        }
        return undefined
      })
    )
  )

const coerceFilter = (arg, opts) => {
  if (!arg) {
    // passing in a falsy value to filter means
    // to not filter anything
    return identity
  }

  const wrapIterator = (iterator) => (items) =>
    items.filter((...args) => iterator(...args, opts))

  if (typeof arg === 'function') {
    return wrapIterator(arg)
  }

  const { value, reject = false } =
    typeof arg === 'string' ? { value: arg } : arg

  // allow it to be wrapped in curlies or not
  const wrapped = value
    .trim()
    .replace(/^([^{])/, (...a) => `{${a[1]}`)
    .replace(/([^}])$/, (...a) => `${a[1]}}`)

  let rJson = null
  try {
    rJson = RJSON.parse(wrapped)
  } catch (e) {
    throw new Error(`${e.message}: ${wrapped}`)
  }

  // deeply map all string values to either regular expressions or
  // functions to allow easy filtering. allows for the following:
  // - '/Title/' (case sensitive regex)
  // - 'SUCCESS' (includes, case insensitive)
  // all matches are done case insensitive unless its a regexp
  // then it uses whatever flags are passed in
  const matcher = deepMapValues(deepMapStrings(rJson), (v) => {
    const regexpLike = v.match(/^\/(.*)\/([igmsuy]*)$/)
    if (regexpLike) {
      return new RegExp(regexpLike[1], regexpLike[2])
    }
    return (matchV) => matchV.toLowerCase().includes(v.toLowerCase())
  })

  const valueMatch = (objValue, srcValue) => {
    if (isRegExp(srcValue)) {
      return srcValue.test(objValue)
    }
    return srcValue(objValue)
  }

  return wrapIterator((item, index) => {
    const match = isMatchWith(
      deepMapStrings({ index, ...item }),
      matcher,
      valueMatch
    )
    return reject ? !match : match
  })
}

export default coerceFilter
