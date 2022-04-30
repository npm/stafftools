export const mkdir = ({ argv, item }) => [
  'mkdir',
  '-p',
  item.repoDir,
  { cwd: argv.cwd },
]

export const clone = ({ argv, item }) => [
  mkdir({ argv, item }),
  [
    'gh',
    'repo',
    'clone',
    `${item.owner}/${item.name}`,
    {
      cwd: item.ownerDir,
      status: ({ status, output }) =>
        status === 1 && output.includes('already exists') && 0,
    },
  ],
]

export const checkout = ({ argv }) => [
  ['git', 'remote', 'show', argv.remote],
  ({ result }) => {
    const [, defaultBranch = ''] =
      result.output.match(/HEAD branch:(.*)/i) || []
    return ['git', 'checkout', defaultBranch.trim()]
  },
]

export const commit = ({ argv }) => [
  'git',
  'commit',
  '-am',
  `"${argv.message}"`,
  {
    status: ({ status, output }) =>
      status === 1 && output.includes('nothing to commit') && 0,
  },
]
