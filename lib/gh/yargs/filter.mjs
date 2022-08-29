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

const coerceFilter = (arg) => {
  if (!arg) {
    // passing in a falsy value to filter means
    // to not filter anything
    return identity
  }

  // allow it to be wrapped in curlies or not
  const rJsonStr = arg
    .trim()
    .replace(/^([^{])/, (...a) => `{${a[1]}`)
    .replace(/([^}])$/, (...a) => `${a[1]}}`)

  // deeply map all string values to either regular expressions or
  // functions to allow easy filtering. allows for the following:
  // - '/Title/' (case sensitive regex)
  // - '!FAILURE' (does not include, case insensitive)
  // - 'SUCCESS' (includes, case insensitive)
  // all matches are done case insensitive unless its a regexp
  // then it uses whatever flags are passed in
  const valueFilter = (value) => {
    const regexpLike = value.match(/^\/(.*)\/([igmsuy]*)$/)
    if (regexpLike) {
      return new RegExp(regexpLike[1], regexpLike[2])
    } else if (value.startsWith('!')) {
      return (v) => !v.toLowerCase().includes(value.slice(1).toLowerCase())
    }
    return (v) => v.toLowerCase().includes(value.toLowerCase())
  }

  const valueMatch = (objValue, srcValue) => {
    if (isRegExp(srcValue)) {
      return srcValue.test(objValue)
    }
    return srcValue(objValue)
  }

  return (items) =>
    items.filter((item, index) =>
      isMatchWith(
        deepMapStrings({ ...item, index }),
        deepMapValues(deepMapStrings(RJSON.parse(rJsonStr)), valueFilter),
        valueMatch
      )
    )
}

export default coerceFilter
