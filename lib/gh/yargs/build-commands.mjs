import { pick, identity, flow } from 'lodash-es'
import * as utils from './utils.mjs'

const getKeys = (yargs) => Object.keys(yargs.getOptions().key)

const createCommandBuilder = ({
  command: baseCommand,
  template: baseTemplate,
  group,
  defaults,
}) => {
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

  const setTemplate = (template) =>
    template
      ? (yargs) => {
          const choices = Object.keys(template.default)
          return yargs.options({
            template: {
              choices,
              type: 'string',
              default: choices[0],
            },
            ...utils.templateOptions(choices),
          })
        }
      : identity

  const start = () => [init, baseCommand.args.builder]

  const end = (subCommand) => [
    setTemplate(subCommand?.template ?? baseTemplate),
    subCommand?.command.args.builder ?? identity,
    groupOptions,
    (yargs) => yargs.default(pick(defaults, getKeys(yargs))),
  ]

  const build = (command, ...builders) => ({
    command: command.name,
    ...command.args,
    builder: flow(...builders),
  })

  const buildSubs = (subCommands) => (yargs) => {
    return yargs.command(
      subCommands.map((subCommand) => {
        return build(subCommand.command, ...end(subCommand))
      })
    )
  }

  return {
    command: (subCommands) =>
      build(baseCommand, ...start(), ...end(), buildSubs(subCommands)),
    mergeCommand: (subCommand) =>
      build(baseCommand, ...start(), ...end(subCommand)),
  }
}

// returns the full list of commands with any related subcommands
// merges all appropriate builders to supply options to each
const buildCommands = ({ workers, queries, templates, group, defaults }) => {
  // All queries are top level commands. Each can be run without any arguments to return
  // the results of the query. A second optional command is the worker to operate on the
  // query.
  const queryCommands = queries.map((query) => {
    const builder = createCommandBuilder({
      command: query,
      template: utils.getTemplateByQuery(templates, query),
      group,
      defaults,
    })

    const workerSubCommands = utils
      .getWorkersByQuery(workers, query)
      .map((worker) => ({
        command: worker,
        template: utils.getTemplateByWorker(templates, worker),
      }))

    return builder.command(workerSubCommands)
  })

  // Only 1 related query means it is the only possible query
  // So merge the builder of the query into the worker to make it a
  // single top level command with all the options
  // otherwise, make a subcommand for each related query
  const topLevelWorkers = workers
    .map((worker) => ({
      worker,
      ...utils.getQueriesByWorker(queries, worker),
    }))
    .filter(({ query }) => query)
    .map(({ worker, query }) => {
      const builder = createCommandBuilder({
        command: worker,
        template: utils.getTemplateByWorker(templates, worker),
        group,
        defaults,
      })

      return builder.mergeCommand({ command: query })
    })

  return [...queryCommands, ...topLevelWorkers]
}

export default buildCommands
