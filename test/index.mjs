import t from 'tap'
import { spawnSync } from 'child_process'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const getHelp = (...cmd) => {
  const { stdout } = spawnSync('node', ['./bin/gh.mjs', ...cmd, '--help'], {
    encoding: 'utf-8',
    cwd: root,
  })
  return stdout
}

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
    t.matchSnapshot(getHelp(...cmd), cmd.join(' '))
  }
})
