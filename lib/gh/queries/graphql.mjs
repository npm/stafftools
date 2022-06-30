import { dirname } from 'path'
import { fileURLToPath } from 'url'
import gql from 'graphql-tag'
import { readFileSync } from 'fs'
import { readdirExt, absOrRel, spawnSync } from '../../utils.mjs'
import { pick, find } from 'lodash-es'

const unwrap = (data) => {
  while (Object.keys(data).length === 1 && !Array.isArray(data)) {
    data = data[Object.keys(data)[0]]
  }
  return data
}

const rawQueries = await readdirExt(
  dirname(fileURLToPath(import.meta.url)),
  '.graphql'
)

const getQueryVariables = (query, fields) => {
  const [queryDefinition] = gql(readFileSync(query, 'utf-8')).definitions
  const varNames = queryDefinition.variableDefinitions.map(
    (v) => v.variable.name.value
  )
  return pick(fields, varNames)
}

export const args = {
  desc: 'Fetch a graphql query',
  builder: (yargs) =>
    yargs.options({
      query: {
        desc: 'path to a query file passed directly to gh api graphql',
        demand: true,
        type: 'string',
        coerce: (query) =>
          find(rawQueries, { name: query })?.path || absOrRel(query),
      },
      cache: {
        desc: 'how long for gh to cache the query',
        default: '1m',
        type: 'string',
      },
    }),
}

export default ({ render, query, cache, ...fields }) => {
  const queryFields = {
    query: `@${query}`,
    ...getQueryVariables(query, fields),
  }

  const ghArgs = [
    'api',
    'graphql',
    cache && `--cache=${cache}`,
    // everything else gets converted to a field which gh
    // passes to the query as a graphql variable
    ...Object.entries(queryFields).flatMap(([key, value]) => [
      '-F',
      `${key}=${value}`,
    ]),
  ].filter(Boolean)

  render.debug('GH ARGS:', ghArgs.join(' '))

  const res = spawnSync('gh', ghArgs, { encoding: 'utf-8' })

  if (res.status !== 0) {
    throw new Error(res.stderr)
  }

  const data = JSON.parse(res.stdout)

  if (data.errors) {
    throw new Error(data.errors.map((e) => e.message).join('\n'))
  }

  // unwrap data from a single top level query
  return unwrap(data)
}
