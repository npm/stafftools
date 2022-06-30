import t from 'tap'
import { spawnSync } from 'child_process'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

t.cleanSnapshot = (s) =>
  s.split(/@npmcli\/stafftools@[^\s]+/).join('@npmcli/stafftools@${VERSION}')

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const runCmd = () =>
  spawnSync('node', ['./bin/stafftools.mjs'], {
    encoding: 'utf-8',
    cwd: root,
  })

t.test('output', async (t) => {
  const res = runCmd()
  t.equal(res.status, 0)
  t.equal(res.stderr, '')
  t.matchSnapshot(res.stdout)
})
