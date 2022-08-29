import * as clone from './clone.mjs'

export const type = clone.type

export const args = {
  ...clone.args,
  desc: 'Checkout and pull default branch of repos',
}

export default [...clone.default, () => ['git', ['pull']]]
