#!/usr/bin/env node

import { basename } from 'path'
import { fileURLToPath } from 'url'
import { npxify, readPkg } from '../lib/utils.mjs'

const __filename = basename(fileURLToPath(import.meta.url), '.mjs')

const pkg = await readPkg()
const pkgBins = Object.keys(pkg.bin)
  .filter((f) => f !== __filename)
  .map((f) => npxify(pkg, f))

const desc = `
${pkg.name}@${pkg.version}

${pkg.description}

Available commands:
  - ${pkgBins.join('\n  - ')}
`.trim()

// eslint-disable-next-line no-console
console.log(desc)
