import semver from 'semver'
import { clone, commit, getPkg } from './_common.mjs'

export const type = 'template-oss'

export const filter = [`title: '@npmcli/template-oss'`]

export const args = {
  desc: 'Fix failing template-oss pull requests',
  builder: (yargs) =>
    yargs.options({
      message: {
        demand: true,
        default: 'postinstall for dependabot template-oss PR',
        desc: 'Commit message to be used for template oss changes, with out the `<TYPE>:` prefix',
      },
    }),
}

const getRemotePkg = ({ run, item }) => {
  const { content } = JSON.parse(
    run('gh', [
      'api',
      `/repos/${item.owner}/${item.name}/contents/package.json?ref=${item.baseRef}`,
    ]).output
  )
  return JSON.parse(Buffer.from(content, 'base64').toString('utf-8'))
}

export default [
  clone,
  () => ['git', ['fetch']],
  ({ item }) => ['gh', ['pr', 'checkout', item.number, '--force']],
  () => ['git', ['clean', '-fd']],
  ({ run, state, argv }) => {
    // undo any commits applying template-oss changes
    let message = run('git', ['log', '-1', '--pretty=%B']).output
    if (message.includes(argv.message)) {
      run('git', ['reset', '--hard', 'HEAD~1'])
      message = run('git', ['log', '-1', '--pretty=%B']).output
    }

    state.message = message
    state.currentVersion = getPkg({ run })?.devDependencies?.[
      '@npmcli/template-oss'
    ]
  },
  ({ run }) => [
    'npm',
    [
      'install',
      '@npmcli/template-oss@latest',
      getPkg({ run })?.workspaces ? '-ws' : '',
      '-iwr',
      '--save-exact',
      '-D',
      '--ignore-scripts',
    ],
  ],
  ({ state, run }) => {
    const updateVersion = getPkg({ run }).devDependencies[
      '@npmcli/template-oss'
    ]
    state.replaceVersion = (str) =>
      str.replace(
        new RegExp(state.currentVersion.replace(/\./, '\\.'), 'g'),
        updateVersion
      )
  },
  ({ state }) =>
    commit({
      argv: { amend: true, message: state.replaceVersion(state.message) },
    }),
  () => [
    'npm',
    ['run', 'template-oss-apply'],
    {
      status: ({ status, output }) =>
        status === 1 && output.includes('Missing script:') && 0,
    },
  ],
  ({ result, item }) => {
    if (result.output.includes('Missing script:')) {
      return [
        'node',
        ['./node_modules/.bin/template-oss-apply', '--force'],
        {
          env: {
            npm_config_local_prefix: item.repoDir,
          },
        },
      ]
    }
  },
  ({ item, run, argv }) => {
    const pkg = getPkg({ run })
    const updateEngines = getPkg({ run }).engines.node
    const baseEngines = getRemotePkg({ run, item })?.engines?.node

    const isBreaking =
      !baseEngines || !semver.subset(baseEngines, updateEngines)

    const commitType = isBreaking ? 'feat!:' : 'chore:'
    const footer = isBreaking
      ? `\n\nBREAKING CHANGE: ` +
        `\`${pkg.name}\` is now compatible with the ` +
        `following semver range for node: \`${updateEngines}\``
      : ''

    argv.message = `${commitType} ${argv.message}${footer}`
  },
  commit,
  () => [
    'npm',
    ['run', 'postlint'],
    {
      status: ({ status, output }) =>
        status === 1 && output.includes('@npmcli/eslint-config') && 0,
    },
  ],
  ({ result }) => {
    if (result.output.includes('@npmcli/eslint-config')) {
      return ['npm', ['i', '@npmcli/eslint-config@latest', '--save-dev']]
    }
  },
  () => commit({ argv: { amend: true, message: null } }),
  ({ state, item }) => [
    'gh',
    ['pr', 'edit', '--title', `"${state.replaceVersion(item.title)}"`],
  ],
  () => ['git', ['push', '--force-with-lease']],
]
