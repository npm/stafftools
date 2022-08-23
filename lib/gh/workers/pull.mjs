import * as clone from './clone.mjs'

export const type = clone.type

export const args = {
  desc: 'Pull default branch of all matching repos',
  builder: clone.args.builder,
}

export default [...clone.default, () => ['git', ['pull']]]
