import t from 'tap'
import { spawnSync } from 'child_process'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

t.cleanSnapshot = (s) =>
  s
    .replace(/(--limit.*\[default: )(\d+)/g, '$1$NUM_CORES')
    .split(process.env.HOME)
    .join('$HOME')

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const getHelp = (...cmd) =>
  spawnSync('node', ['./bin/gh.mjs', ...cmd, '--help'], {
    encoding: 'utf-8',
    cwd: root,
  })

t.test('help messages', async (t) => {
  const commands = [
    [],
    ['clone'],
    ['merge'],
    ['merge', 'dependabot'],
    ['merge', 'pending-release'],
    ['merge', 'pull-requests'],
    ['publish'],
    ['template-oss-fix'],
    ['dependabot'],
    ['graphql'],
    ['pending-release'],
    ['pull-requests'],
    ['repos'],
  ]

  for (const cmd of commands) {
    const res = getHelp(...cmd)
    t.equal(res.status, 0)
    t.equal(res.stderr, '')
    t.matchSnapshot(res.stdout, cmd.join(' '))
  }
})
