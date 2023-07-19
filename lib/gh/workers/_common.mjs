import { flow } from 'lodash-es'

export const mkdirp = ({ argv, item }) => [
  ['mkdir', ['-p', item.repoDir], { cwd: argv.cwd }],
]

export const clone = ({ argv, item }) => [
  mkdirp({ argv, item }),
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
  ({ result, state }) => {
    const [, defaultBranch = ''] =
      result.output.match(/HEAD branch:(.*)/i) || []
    state.defaultBranch = defaultBranch.trim()
    return ['git', ['checkout', state.defaultBranch]]
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

export const op = ({ argv }) =>
  // A special string for otp will attempt to run the 1Password
  // cli to get the otp for an item named "npm"
  ['1p', 'op'].includes(argv.otp?.toLowerCase())
    ? ['op', ['item', 'get', 'npm', '--otp']]
    : ['echo', [argv.otp]]

export const publish = ({ argv }) => [
  op({ argv }),
  ({ result }) => ['npm', ['publish', `--otp=${result.output}`]],
]

export const getPkg = () => [
  'cat',
  ['package.json'],
  { parse: (r) => safeJSONParse(r) ?? {} },
]

export const ghApi = (...args) => [
  'gh',
  ['api', ...args],
  {
    parse: (r) => safeJSONParse(r),
  },
]

export const getRemotePkg = ({ item, ref }) => {
  const parts = ghApi(
    `/repos/${item.owner}/${item.name}/contents/package.json${
      ref ? `?ref=${ref}` : ''
    }`
  )
  const opts = parts.pop()
  return [
    ...parts,
    {
      ...opts,
      parse: flow(opts.parse, (result) =>
        result?.content
          ? safeJSONParse(
              Buffer.from(result.content, 'base64').toString('utf-8')
            )
          : null
      ),
    },
  ]
}

export const safeJSONParse = (r) => {
  try {
    return JSON.parse(r)
  } catch {
    return null
  }
}
