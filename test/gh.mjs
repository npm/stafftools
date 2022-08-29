import t from 'tap'
import { spawnSync } from 'child_process'
import { dirname, resolve, sep, join } from 'path'
import { fileURLToPath } from 'url'
import * as utils from '../lib/gh/yargs/utils.mjs'

t.cleanSnapshot = (s) =>
  s
    .replace(/(--limit.*\[default: )(\d+)/g, '$1$NUM_CORES')
    .split(process.env.HOME + sep)
    .join('$HOME/')

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const getHelp = (...cmd) =>
  spawnSync('node', ['./bin/gh.mjs', ...cmd, '--help'], {
    encoding: 'utf-8',
    cwd: root,
  })

t.test('all commands', async (t) => {
  const queries = await utils.readdirCommands(join(root, 'lib/gh/queries'))
  const workers = await utils.readdirCommands(join(root, 'lib/gh/workers'))

  const commands = [
    [],
    ...queries.flatMap((query) => [
      [query.name],
      ...utils
        .getWorkersByQuery(workers, query)
        .map((worker) => [query.name, worker.name]),
    ]),
  ]

  t.matchSnapshot(
    commands.map((c) => `gh ${c.join(' ')}`).join('\n'),
    'all commands'
  )

  for (const cmd of commands) {
    await t.test(`help ${cmd.join(' ')}`, async (t) => {
      const res = getHelp(...cmd)
      t.equal(res.status, 0)
      t.equal(res.stderr, '')
      t.matchSnapshot(res.stdout.trim())
    })
  }
})
