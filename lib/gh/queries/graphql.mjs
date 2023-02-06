import { dirname } from 'path'
import { fileURLToPath } from 'url'
import gql from 'graphql-tag'
import { print as printGql } from 'graphql'
import { readFileSync } from 'fs'
import { readdirExt, absOrRel, spawnSync } from '../../utils.mjs'
import { pick, find } from 'lodash-es'

const rawQueries = await readdirExt(
  dirname(fileURLToPath(import.meta.url)),
  '.graphql'
)

const paginateQuery = (q) => {
  q.definitions[0].variableDefinitions.push(
    {
      kind: 'VariableDefinition',
      variable: {
        kind: 'Variable',
        name: {
          kind: 'Name',
          value: 'after',
        },
      },
      type: {
        kind: 'NamedType',
        name: {
          kind: 'Name',
          value: 'String',
        },
      },
      directives: [],
    },
    {
      kind: 'VariableDefinition',
      variable: {
        kind: 'Variable',
        name: {
          kind: 'Name',
          value: 'first',
        },
      },
      type: {
        kind: 'NonNullType',
        type: {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'Int',
          },
        },
      },
      directives: [],
    }
  )

  q.definitions[0].selectionSet.selections[0].arguments.push(
    {
      kind: 'Argument',
      name: {
        kind: 'Name',
        value: 'after',
      },
      value: {
        kind: 'Variable',
        name: {
          kind: 'Name',
          value: 'after',
        },
      },
    },
    {
      kind: 'Argument',
      name: {
        kind: 'Name',
        value: 'first',
      },
      value: {
        kind: 'Variable',
        name: {
          kind: 'Name',
          value: 'first',
        },
      },
    }
  )

  q.definitions[0].selectionSet.selections[0].selectionSet.selections.push({
    kind: 'Field',
    name: {
      kind: 'Name',
      value: 'pageInfo',
    },
    arguments: [],
    directives: [],
    selectionSet: {
      kind: 'SelectionSet',
      selections: [
        {
          kind: 'Field',
          name: {
            kind: 'Name',
            value: 'hasNextPage',
          },
          arguments: [],
          directives: [],
        },
        {
          kind: 'Field',
          name: {
            kind: 'Name',
            value: 'endCursor',
          },
          arguments: [],
          directives: [],
        },
      ],
    },
  })

  return q
}

const logIncompleteNodes = (render, data) => {
  Object.entries(data).forEach(([key, value]) => {
    if (value && typeof value === 'object') {
      if (Array.isArray(value.nodes)) {
        if (value?.pageInfo?.hasNextPage) {
          render.warn(`${data.id} -- ${key} has incomplete results`)
        }
        value.nodes.forEach((node) => logIncompleteNodes(render, node))
      }
    }
  })
}

const getQueryVariables = (query, fields) => {
  const [queryDefinition] = query.definitions
  const varNames = queryDefinition.variableDefinitions.map(
    (v) => v.variable.name.value
  )
  return pick(fields, varNames)
}

export const filter = []

export const args = {
  desc: 'Fetch a graphql query',
  builder: (yargs) =>
    yargs.options({
      query: {
        desc: 'path to a query file passed directly to gh api graphql',
        demand: true,
        type: 'string',
      },
      cache: {
        desc: 'how long for gh to cache the query',
        default: '1m',
        type: 'string',
      },
    }),
}

const runQuery = ({ render, query, cache, fields, results = [] }) => {
  const ghArgs = [
    'api',
    'graphql',
    cache && `--cache=${cache}`,
    // everything else gets converted to a field which gh
    // passes to the query as a graphql variable
    ...Object.entries(fields).flatMap(([key, value]) => [
      '-F',
      `${key}=${value}`,
    ]),
    '-f',
    `query=${query}`,
  ].filter(Boolean)

  render.debug('GH ARGS:', ghArgs.join(' '))

  const proc = spawnSync('gh', ghArgs, { encoding: 'utf-8' })

  if (proc.status !== 0) {
    throw new Error(proc.stderr)
  }

  const { errors, data } = JSON.parse(proc.stdout)

  if (errors) {
    throw new Error(errors.map((e) => e.message).join('\n'))
  }

  const queryName = Object.keys(data)[0]
  const queryData = data[queryName]
  const allResults = results.concat(queryData.nodes)

  if (queryData.pageInfo.hasNextPage) {
    return runQuery({
      render,
      query,
      cache,
      fields: { ...fields, after: queryData.pageInfo.endCursor },
      results: allResults,
    })
  }

  allResults.forEach((node) => logIncompleteNodes(render, node))

  return allResults
}

export default ({ render, query, cache, ...fields }) => {
  const queryPath = find(rawQueries, { name: query })?.path || absOrRel(query)
  const queryAst = paginateQuery(gql(readFileSync(queryPath, 'utf-8')))
  const queryFields = getQueryVariables(queryAst, fields)

  return runQuery({
    render,
    query: printGql(queryAst),
    cache,
    fields: { ...queryFields, first: 10 },
  })
}
