import { basename, dirname, extname, isAbsolute, resolve } from 'path'
import { fileURLToPath } from 'url'
import { transform } from 'lodash-es'
import { readdir, readFile } from 'fs/promises'

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
