import { basename, dirname, extname, isAbsolute, resolve } from 'path'
import { fileURLToPath } from 'url'
import { transform } from 'lodash-es'
import { readdir, readFile } from 'fs/promises'
import which from 'which'
import { spawnSync as cpSpawnSync } from 'child_process'

export const readJson = async (p) => JSON.parse(await readFile(p, 'utf-8'))

export const readPkg = async (p) => {
  const dir = dirname(fileURLToPath(import.meta.url))
  return readJson(resolve(dir, '..', 'package.json'))
}

export const npxify = (pkg, cmd = '') => `npx -p ${pkg.name} -- ${cmd}`.trim()

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
      .filter((p) =>
        !exts.length ? true : exts.includes(p.ext) && !p.name.startsWith('_')
      )
  )

export const spawnSync = (cmd, ...args) => {
  let whichCmd = null
  try {
    whichCmd = which.sync(cmd)
  } catch {
    throw new Error(
      `Could not find executable ${cmd.toString()}. ` +
        'It must should be installed in your $PATH before running this command.'
    )
  }
  return cpSpawnSync(whichCmd, ...args)
}

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
