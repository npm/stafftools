#!/usr/bin/env node

import { resolve, dirname, basename, join } from 'path'
import os from 'os'
import { fileURLToPath } from 'url'
import Yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { flow, transform, identity, noop } from 'lodash-es'
import createRender from '../lib/gh/render/index.mjs'
import run from '../lib/gh/index.mjs'
import coerceFilter from '../lib/gh/yargs/filter.mjs'
import { absOrRel, addProps, npxify, readJson, readPkg } from '../lib/utils.mjs'
import * as yargsUtils from '../lib/gh/yargs/utils.mjs'
import parseCommand from '../lib/gh/yargs/parse-command.mjs'
import buildCommands from '../lib/gh/yargs/build-commands.mjs'

const __pathname = fileURLToPath(import.meta.url)
const __filename = basename(__pathname, '.mjs')
const __dirname = dirname(__pathname)
const libDir = resolve(__dirname, '..', 'lib', 'gh')

const [pkg, defaults, workers, queries, templates] = await Promise.all([
  readPkg(),
  readJson(join(libDir, 'config.json')),
  yargsUtils.readdirCommands(join(libDir, 'workers')),
  yargsUtils.readdirCommands(join(libDir, 'queries')),
  yargsUtils.readdirCommands(join(libDir, 'templates')),
])

const optionGroups = {
  other: 'Other Options:',
  global: 'Global Options:',
  command: 'Command Options:',
}

const globalTemplates = {
  json: (v) => JSON.stringify(v, null, 2),
  silent: noop,
}
const templateKeys = Object.keys(globalTemplates)

const options = {
  cwd: {
    alias: 'c',
    default: resolve(process.env.HOME, 'projects'),
    demand: true,
    desc: 'base directory to run all commands',
    type: 'string',
    coerce: absOrRel,
  },
  limit: {
    alias: 'l',
    default: os.cpus().length - 1,
    desc: 'number of worker threads to spawn',
    type: 'number',
  },
  filter: {
    alias: 'f',
    desc: 'filters to be parsed as relaxed json and applied to the data',
    type: 'array',
  },
  clean: {
    default: false,
    desc: 'whether to rimraf the cwd first',
    type: 'boolean',
  },
  template: {
    default: 'json',
    demand: true,
    desc: 'how to format the final output',
    type: 'string',
    choices: templateKeys,
  },
  ...yargsUtils.templateOptions(templateKeys),
  progress: {
    hidden: true,
    default: process.stderr.isTTY,
    desc: 'whether to show progress',
    type: 'boolean',
  },
  rows: {
    hidden: true,
    default: process.stderr.rows,
    type: 'number',
  },
  'id-key': {
    hidden: true,
    default: 'id',
    type: 'string',
  },
  debug: {
    hidden: true,
    type: 'array',
    coerce: (v) =>
      transform(v.length ? v : ['log'], (acc, k) => (acc[k] = true), {}),
  },
}

const middleware = [
  async (argv) => ({
    command: await parseCommand({
      workers,
      queries,
      templates,
      argv,
    })
      .then(({ worker, query, template }) => ({
        // Set the worker to the path since it will be imported
        // via the path from within the worker thread
        worker: worker?.default && worker.path,
        query: query?.default,
        template,
        filter: flow(
          identity,
          ...[
            ...(query?.filter || []),
            ...(worker?.filter || []),
            ...(argv?.filter || []),
          ]
            .filter(Boolean)
            .map(coerceFilter)
        ),
      }))
      .catch((err) => err),
  }),
  (argv) => {
    // convert all boolean template vars to a single template name
    // this makes the last one win if multiple are set
    const allTemplates = {
      ...globalTemplates,
      ...argv.command.template?.default,
    }

    delete argv.command.template

    for (const t of Object.keys(allTemplates)) {
      if (argv[t] === true) {
        argv.template = t
      }
      delete argv[t]
    }

    return {
      template: allTemplates[argv.template],
    }
  },
  (argv) => ({
    progress: argv.command.worker ? argv.progress : false,
    debug: typeof argv.debug === 'object' ? argv.debug : {},
  }),
  (argv) => ({
    // worker data must be safe to be passed to a worker
    // via structured clone, so no functions, etc
    workerData: JSON.parse(JSON.stringify(argv)),
  }),
]

const yargs = Yargs(hideBin(process.argv))
  .scriptName(npxify(pkg, __filename))
  .updateStrings({ 'Options:': optionGroups.other })
  .config('config')
  .options(addProps(options, { global: true, group: optionGroups.global }))
  .command(
    buildCommands({
      workers,
      queries,
      templates,
      group: optionGroups.command,
      defaults,
    })
  )
  .demandCommand()
  .middleware(middleware)
  .check((argv) => argv.command)
  .wrap(Yargs.terminalWidth)

const argv = await yargs.argv
const render = createRender(argv)
render.debug('ARGV:', argv)

run({ render, ...argv })
  .then((res) => {
    const display = argv.template(res)
    if (display != null) {
      render.output(display)
    }
  })
  .catch((err) => {
    render.outputError(err)
    process.exit(1)
  })
