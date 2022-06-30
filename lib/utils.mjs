import * as path from 'path'
import { fileURLToPath } from 'url'
import { transform } from 'lodash-es'
import { readdir, readFile } from 'fs/promises'
import which from 'which'
import { spawnSync as cpSpawnSync } from 'child_process'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// get the bin dir from the top most parent of a node_modules dir
// since that is where the npx cache is
const binDir = cpSpawnSync('npm', ['bin'], {
  encoding: 'utf-8',
  cwd: rootDir.replace(new RegExp(`${path.sep}node_modules.*`), ''),
}).stdout.trim()

export const readJson = async (p) => JSON.parse(await readFile(p, 'utf-8'))

export const readPkg = () => readJson(path.join(rootDir, 'package.json'))

export const npxify = (pkg, cmd = '') => `npx -p ${pkg.name} ${cmd}`.trim()

export const addProps = (obj, props) =>
  transform(obj, (res, value, key) => {
    res[key] = { ...value, ...props }
  })

export const absOrRel = (p) =>
  path.isAbsolute(p) ? p : path.resolve(process.cwd(), p)

export const readdirExt = async (dir, ...exts) =>
  readdir(dir).then((files) =>
    files
      .map((p) => ({
        ext: path.extname(p),
        name: path.basename(p, path.extname(p)),
        path: path.resolve(dir, p),
      }))
      .filter((p) =>
        !exts.length ? true : exts.includes(p.ext) && !p.name.startsWith('_')
      )
  )

export const spawnSync = (cmd, args, options = {}) => {
  // the bin dir when running inside npx is our local bin dir
  // which is a problem because we dont want to look there for
  // globally installed commands like `gh` so we remove it from the
  // PATH when looking up and running the commands
  const envPath = process.env.PATH.split(path.delimiter)
    .filter((p) => p !== binDir)
    .join(path.delimiter)

  let whichCmd = null
  try {
    whichCmd = which.sync(cmd, { path: envPath })
  } catch {
    throw new Error(
      `Could not find executable ${cmd.toString()}. ` +
        'It must should be installed in your $PATH before running this command.'
    )
  }
  return cpSpawnSync(whichCmd, args, {
    ...options,
    env: { ...process.env, ...options.env, PATH: envPath },
  })
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
