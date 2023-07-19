import { REPO } from '../types.mjs'
import { apiOnlyOptions, fallbackToStdin } from '../yargs/utils.mjs'
import { getRemotePkg, ghApi } from './_common.mjs'

export const type = REPO

export const filter = [
  (item, index, list) => {
    if (list.length > 1) {
      throw new Error(
        'This worker can only be run on a single repo.\n' +
          "Use the `--repos='repo:npm/<NAME>'` to filter to a single repo"
      )
    }
    return true
  },
]

const npmToken = fallbackToStdin('npm-token', {
  desc: 'the npm token to use',
})

export const args = {
  desc: 'Set Publish Tokens',
  builder: (yargs) =>
    yargs.options({
      'op-account': {
        default: 'github.1password.com',
        desc: '1Password Account',
        type: 'string',
        demand: true,
      },
      'op-item': {
        default: 'npm cli ops (npm)',
        desc: '1Password item',
        type: 'string',
        demand: true,
      },
      'secret-name': {
        default: 'PUBLISH_TOKEN',
        desc: 'name of the repo secret to create',
        type: 'string',
        demand: true,
      },
      ...npmToken.options,
      ...apiOnlyOptions(),
    }),
  handler: npmToken.handler,
}

export default [
  ({ run, item, argv }) => {
    const packageName = run(...getRemotePkg({ item })).name.replace(
      /\./g,
      '\\.'
    )
    return [
      'op',
      [
        'item',
        'edit',
        `"${argv.opItem}"`,
        `--account='${argv.opAccount}'`,
        `'granular access tokens.${packageName}[password]=${argv.npmToken}'`,
      ],
      {
        parse: (r) => {
          const rName = new RegExp(`^\\s+${packageName}:\\s+`)
          const line = r.split('\n').find((l) => rName.test(l))
          return line.replace(/\s+/g, ' ').trim()
        },
      },
    ]
  },
  ({ item }) =>
    ghApi(`/repos/${item.owner}/${item.name}/actions/secrets/public-key`),
  ({ sodium, item, argv, result }) => {
    const { key, key_id: keyId } = result.output

    const binkey = sodium.from_base64(key, sodium.base64_variants.ORIGINAL)
    const binsec = sodium.from_string(argv.npmToken)
    const encBytes = sodium.crypto_box_seal(binsec, binkey)
    const encryptedValue = sodium.to_base64(
      encBytes,
      sodium.base64_variants.ORIGINAL
    )

    return ghApi(
      '--method',
      'PUT',
      `/repos/${item.owner}/${item.name}/actions/secrets/${argv.secretName}`,
      '-f',
      `encrypted_value='${encryptedValue}'`,
      '-f',
      `key_id='${keyId}'`
    )
  },
]
