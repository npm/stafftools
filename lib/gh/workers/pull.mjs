import * as clone from './clone.mjs'

export const type = clone.type

export const filter = [...clone.filter]

export const args = {
  ...clone.args,
  desc: 'Checkout and pull default branch of repos',
}

export default [...clone.default, () => ['git', ['pull']]]
