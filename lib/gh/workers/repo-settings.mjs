import { REPO } from '../types.mjs'

export const type = REPO

export const args = {
  desc: 'Set common settings on all repos',
  builder: (yargs) =>
    yargs.options({
      limit: {
        default: 1,
        hidden: true,
      },
      'branch-protection': {
        type: 'boolean',
        default: false,
        desc: 'Whether to apply branch protection rules',
      },
    }),
}

export default [
  ({ item, argv }) => [
    'gh',
    [
      'repo',
      'edit',
      item.nameWithOwner,
      '--enable-merge-commit=false',
      '--enable-rebase-merge=true',
      '--enable-squash-merge=true',
      '--delete-branch-on-merge=true',
    ],
    { cwd: argv.cwd },
  ],
  ({ item, argv }) => [
    'gh',
    [
      'api',
      '--method',
      'POST',
      `/repos/${item.nameWithOwner}/labels`,
      '-f',
      `name='Dependencies'`,
      '-f',
      `description='Pull requests that update a dependency file'`,
      '-f',
      `color='00cc00'`,
    ],
    {
      cwd: argv.cwd,
      status: ({ stdout }) => {
        try {
          if (
            JSON.parse(stdout).errors.find((e) => e.code === 'already_exists')
          ) {
            return 0
          }
        } catch {
          return null
        }
      },
    },
  ],
  ({ item, argv }) =>
    argv.branchProtection
      ? [
          'gh',
          [
            'api',
            '--method',
            'PUT',
            `/repos/${item.nameWithOwner}/branches/${item.defaultBranch}/protection`,
            '--input',
            '-', // Only way to make this call with gh cli is by using stdin
          ],
          {
            cwd: argv.cwd,
            input: JSON.stringify({
              // TODO: this is a more strict branch protectin rule
              // required_pull_request_reviews: {
              //   dismiss_stale_reviews: false,
              //   require_code_owner_reviews: false,
              //   required_approving_review_count: 0,
              // },
              // required_linear_history: true,
              // required_conversation_resolution: true,
              // required_signatures: true,
              // required_status_checks: {
              //   strict: true,
              //   checks: [{ context: 'TODO add context names from actions' }]
              // },
              required_status_checks: null,
              enforce_admins: true,
              required_pull_request_reviews: null,
              restrictions: {
                users: [],
                teams: ['cli-team'],
              },
              required_linear_history: false,
              allow_force_pushes: false,
              allow_deletions: false,
            }),
          },
        ]
      : null,
]
