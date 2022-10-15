import chalk from 'chalk'
import { tableify } from '../render/utils.mjs'
import { REPO } from '../types.mjs'

export const type = REPO

export const def = 'table'

export default {
  table: tableify((repo) => [
    repo.isArchived ? chalk.red('⚠') : ' ',
    repo.owner,
    repo.name,
    repo.pkg ? `${repo.pkg.name}@${repo.pkg.version}` : '',
    repo.url,
    repo.pkg?.templateOSS?.version
      ? `template-oss@${repo.pkg.templateOSS.version}`
      : '',
    Object.keys(repo.pkg?.templateOSS ?? {}).filter(
      (k) => k !== 'version' && !k.startsWith('//@')
    ),
  ]),
  confirm: tableify((repo) => [`${repo.owner}/${repo.name}`]),
}
