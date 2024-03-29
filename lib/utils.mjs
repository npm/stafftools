import * as path from 'path'
import { fileURLToPath } from 'url'
import { transform, has } from 'lodash-es'
import { readdir, readFile } from 'fs/promises'
import which from 'which'
import { existsSync } from 'fs'
import { spawnSync as cpSpawnSync } from 'child_process'
import { minimatch } from 'minimatch'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

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

const removeNpxCache = (env) => {
  const npmCache = env.npm_config_cache
  const npxBin =
    npmCache &&
    path.join(env.npm_config_cache, '_npx', '**', 'node_modules', '.bin')

  const isPath = (k) => /^path$/i.test(k)

  const pathVal = Object.entries(env)
    .filter(([k, v]) => isPath(k) && v)
    .map(([, v]) => v.split(path.delimiter))
    .reduce(
      (set, p) => set.concat(p.filter((concatted) => !set.includes(concatted))),
      []
    )
    .filter((p) => (npxBin ? !minimatch(p, npxBin) : true))
    .join(path.delimiter)

  for (const key of Object.keys(env)) {
    if (isPath(key)) {
      env[key] = pathVal
    }
  }

  return { env, path: pathVal }
}

export const spawnSync = (cmd, args, options = {}) => {
  // this removes the npx cache bin from the path we use to find and
  // execute the command. this is necessary because when we call `gh`
  // it will find the local `bin/gh.mjs` file and attept to execute it
  const { env, path: pathVal } = removeNpxCache({
    ...process.env,
    ...options.env,
  })
  let whichCmd = null
  try {
    whichCmd = which.sync(cmd, { path: pathVal })
  } catch {
    throw new Error(
      `Could not find executable ${cmd.toString()}. ` +
        'It must should be installed in your $PATH before running this command.'
    )
  }

  // cwd set to null is a special value that means the command is designed to
  // not run in a specific directory. since many of the commands run use gh
  // which will infer the repo from the cwd, we set it explicitly to the root
  // dir which is not likely to be a git directory
  if (options.cwd === null) {
    options.cwd = path.parse(process.cwd()).root
  }

  // if cwd has been set explicitly, then we want to throw an earlier error
  // rather than wather for the child_process command to fail
  if (has(options, 'cwd')) {
    // this could happen if cwd is being set for a specific command from a
    // property that doesnt exist
    if (typeof options.cwd !== 'string') {
      throw new Error('`cwd` is not a string')
    }
    if (!existsSync(options.cwd)) {
      throw new Error('`cwd` does not exist: ' + options.cwd)
    }
  }

  return cpSpawnSync(whichCmd, args, { ...options, env })
}

export const runDryCommand = ({ debug }) => {
  if (debug.delay) {
    spawnSync('sleep', [Math.random() * 5])
  }
  const error = debug.error && Math.random() <= 0.1
  const stderr = error ? 'DRY RUN ERROR' : ''
  const stdout = error ? '' : 'DRY RUN'
  return {
    status: error ? 1 : 0,
    output: [error ? stderr : stdout],
    stdout,
    stderr,
  }
}
