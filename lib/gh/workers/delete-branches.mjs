import * as pull from './pull.mjs'

export const type = pull.type

export const filter = [...pull.filter]

export const args = {
  ...pull.args,
  desc: 'Delete branches of repos with no remote counterpart',
}

// We rebase a lot of our branches which makes it difficult for git to know that
// they were merged so they can be cleaned up. But we do delete them
// automatically on the remote. This command will delete all local branches that
// do not have a corresponding remote branch.
export default [
  ...pull.default,
  () => ['git', ['fetch', '-p']],
  () => ['git', ['branch', '-vv']],
  ({ result, run }) => {
    const branches = result.output
      .split('\n')
      .filter((l) => l.includes(': gone] '))
      .map((l) => l.trim().split(' ')[0])

    for (const branch of branches) {
      run('git', ['branch', '-D', branch])
    }
  },
]
