import { pick, identity, flow } from 'lodash-es'
import { templateOptions } from './utils.mjs'

const getKeys = (yargs) => Object.keys(yargs.getOptions().key)

const buildCommand = (command, ...builders) => ({
  command: command.name,
  ...command.args,
  builder: flow(...builders),
})

const createBuilder = (command, { type, template, group, defaults }) => {
  // tracks all options set on a yargs instance and allows
  // group to be called at any point in the builder process
  // to separate all recently added options into their own group
  let yargsInstance = null
  const options = new Set()

  const init = (yargs) => {
    yargsInstance = yargs
    getKeys(yargs).forEach(options.add, options)
    return yargs
  }

  const groupOptions = (yargs) => {
    const newKeys = getKeys(yargsInstance).filter((k) => !options.has(k))
    newKeys.forEach(options.add, options)
    return yargs.group(newKeys, group)
  }

  const setTemplates = template
    ? (yargs) => {
        const choices = Object.keys(template.default)
        return yargs.options({
          template: {
            choices,
            type: 'string',
            ...(type === 'query' ? { default: choices[0] } : {}),
          },
          ...templateOptions(choices),
        })
      }
    : identity

  const start = () => [init, command.args.builder, setTemplates]
  const end = (subCommand) => [
    subCommand ? subCommand.args.builder : identity,
    groupOptions,
    (yargs) => yargs.default(pick(defaults, getKeys(yargs))),
  ]

  return {
    start,
    end,
    build: (subCommand) =>
      buildCommand(command, ...start(), ...end(subCommand)),
  }
}

// returns the full list of commands with any related subcommands
// merges all appropriate builders to supply options to each
const buildCommands = ({ workers, queries, templates, group, defaults }) => {
  const findRelatedQueries = (command) =>
    queries.filter(
      (query) =>
        !command.type ||
        command.type === query.name ||
        command.type === query.type
    )

  const findMatchingTemplate = (command) =>
    templates.find((template) => command.type === template.type)

  const workerCommands = workers.map((worker) => {
    const relatedQueries = findRelatedQueries(worker)
    const builder = createBuilder(worker, {
      template: findMatchingTemplate(worker),
      group,
      defaults,
      type: 'worker',
    })

    // Only 1 related query specified as a string means it is the only possible query
    // So merge the builder of the query into the worker to make it a
    // single top level command with all the options
    // otherwise, make a subcommand for each related query
    if (relatedQueries.length === 1 && typeof worker.type === 'string') {
      return builder.build(relatedQueries[0])
    }

    return buildCommand(worker, ...builder.start(), ...builder.end(), (yargs) =>
      yargs.command(
        relatedQueries.map((query) =>
          buildCommand(query, ...builder.end(query))
        )
      )
    )
  })

  const queryCommands = queries.map((query) =>
    createBuilder(query, {
      template: findMatchingTemplate(query),
      group,
      defaults,
      type: 'query',
    }).build()
  )

  return [...workerCommands, ...queryCommands]
}

export default buildCommands
