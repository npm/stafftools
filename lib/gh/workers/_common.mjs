export const clone = ({ argv, item }) => [
  ['mkdir', ['-p', item.repoDir], { cwd: argv.cwd }],
  [
    'gh',
    ['repo', 'clone', `${item.owner}/${item.name}`],
    {
      cwd: item.ownerDir,
      status: ({ status, output }) =>
        status === 1 && output.includes('already exists') && 0,
    },
  ],
]

export const checkout = ({ argv }) => [
  ['git', ['remote', 'show', argv.remote]],
  ({ result }) => {
    const [, defaultBranch = ''] =
      result.output.match(/HEAD branch:(.*)/i) || []
    return ['git', ['checkout', defaultBranch.trim()]]
  },
]

export const commit = ({ argv }) => [
  ['git', ['add', '.']],
  [
    'git',
    [
      'commit',
      '-a',
      ...(argv.amend
        ? ['--amend', ...(!argv.message ? ['--no-edit'] : [])]
        : []),
      // escape backticks in commit message
      // XXX: should other things be escaped here?
      ...(argv.message ? ['-m', `"${argv.message.replace(/`/g, '\\`')}"`] : []),
    ],
    {
      status: ({ status, output }) =>
        status === 1 && output.includes('nothing to commit') && 0,
    },
  ],
]

export const publish = ({ argv }) => [
  // A special string for otp will attempt to run the 1Password
  // cli to get the otp for an item named "npm"
  argv.otp === 'OP'
    ? ['op', ['item', 'get', 'npm', '--otp']]
    : ['echo', [argv.otp]],
  ({ result }) => ['npm', ['publish', `--otp=${result.output.trim()}`]],
]
