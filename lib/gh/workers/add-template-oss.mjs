import { flow, join } from 'lodash-es'
import * as pull from './pull.mjs'
import { commit, getPkg, mkdirp } from './_common.mjs'
import { EXIT } from '../worker/thread.mjs'

export const type = pull.type

export const filter = [
  ...pull.filter,
  (item) => item.name !== 'documentation' && item.name !== 'rfcs',
  (item) => {
    return (
      item.pkg &&
      !Object.hasOwn(item.pkg.devDependencies || {}, '@npmcli/template-oss')
    )
  },
]

export const args = {
  desc: 'Add template-oss to a repo',
  builder: flow(pull.args.builder, (yargs) =>
    yargs.options({
      install: {
        type: 'boolean',
        default: true,
        desc: 'install deps',
      },
    })
  ),
}

export const success = ({ state }) => state.success

export default [
  mkdirp,
  ({ run, state }) => {
    const { output: url } = run('gh', [
      'pr',
      'list',
      '-L=1',
      '-l=Dependencies',
      '-S=template-oss',
      '--json=url',
      '-q',
      '.[].url',
    ])
    if (url) {
      state.success = url
      return ['echo', [], { status: () => EXIT }]
    }
  },
  ...pull.default,
  ({ argv }) =>
    argv.install && [
      ['npm', ['i']],
      ['npm', ['rm', 'eslint', '@npmcli/lint']],
      [
        'npm',
        ['i', '@npmcli/eslint-config@latest', 'tap@latest', '--save-dev'],
      ],
      [
        'npm',
        ['i', '@npmcli/template-oss@latest', '--save-dev', '--save-exact'],
      ],
    ],
  ({ run }) => {
    const main = getPkg({ run })?.main
    if (join(main) === 'index.js') {
      return [
        ['mkdir', ['-p', 'lib']],
        ['mv', ['index.js', 'lib/index.js']],
        ['npm', ['pkg', 'set', 'main=lib/index.js']],
      ]
    }
  },
  () => ['rm', ['.travis.yml', 'package-lock.json'], { status: () => 0 }],
  () => [
    'npm',
    ['run', 'lintfix'],
    {
      status: () => 0,
    },
  ],
  () => [
    'npm',
    ['run', 'postlint'],
    {
      status: () => 0,
    },
  ],
  () => ['git', ['status']],
  ({ argv }) => argv.force && ['git', ['branch', '-D', 'deps/template-oss']],
  () => ['git', ['checkout', '-b', 'deps/template-oss']],
  ({ run }) => {
    const v = getPkg({ run }).devDependencies['@npmcli/template-oss']
    return commit({
      argv: { message: `chore: bump @npmcli/template-oss to ${v}` },
    })
  },
  ({ argv }) => [
    'git',
    ['push', argv.remote, 'deps/template-oss', '--force-with-lease'],
  ],
  ({ state }) => [
    'gh',
    [
      'pr',
      'create',
      '-f',
      '--draft',
      '-l',
      'Dependencies',
      '--head',
      'deps/template-oss',
      '--base',
      state.defaultBranch,
    ],
  ],
]
