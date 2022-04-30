import { spawnSync } from 'child_process'
import { basename, extname, isAbsolute, resolve } from 'path'
import { transform } from 'lodash-es'
import { readdir, readFile } from 'fs/promises'

export const readJson = async (p) => JSON.parse(await readFile(p, 'utf-8'))

export const addProps = (obj, props) =>
  transform(obj, (res, value, key) => {
    res[key] = { ...value, ...props }
  })

export const absOrRel = (p) => (isAbsolute(p) ? p : resolve(process.cwd(), p))

export const readdirExt = async (dir, ...exts) =>
  readdir(dir).then((files) =>
    files
      .map((p) => ({
        ext: extname(p),
        name: basename(p, extname(p)),
        path: resolve(dir, p),
      }))
      .filter((p) => exts.includes(p.ext) && !p.name.startsWith('_'))
  )

export const runDryCommand = ({ debug }) => {
  if (debug.delay) {
    spawnSync('sleep', [Math.random() * 5])
  }
  const error = debug.error && Math.random() <= 0.1
  return {
    status: error ? 1 : 0,
    output: [error ? 'A random error occurred!' : 'All good'],
  }
}
