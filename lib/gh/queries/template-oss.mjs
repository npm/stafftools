import baseQuery, * as base from './dependabot.mjs'

export const type = base.type

export const filter = [...base.filter, `title: '@npmcli/template-oss'`]

export const args = {
  desc: 'Fetch template-oss pull requests',
  builder: base.args.builder,
}

export default baseQuery
