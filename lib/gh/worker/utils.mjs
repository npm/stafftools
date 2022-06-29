import { spawnSync } from 'child_process'

export const runDryCommand = ({ debug }) => {
  if (debug.delay) {
    spawnSync('sleep', [Math.random() * 5])
  }
  const error = debug.error && Math.random() <= 0.1
  return {
    status: error ? 1 : 0,
    output: [error ? 'A random error occurred!' : 'All good'],
  }
}
