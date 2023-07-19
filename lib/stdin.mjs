import fs from 'fs'
import tty from 'tty'

export const readProcessInput = async () => {
  const stream = process.stdin

  let res = null

  if (!stream.isTTY) {
    res = ''
    stream.once('data', (d) => (res += d.toString().trim()))
    await new Promise((resolve) => stream.once('end', resolve))
  }

  return res
}

const getTTY = (stream) => {
  if (stream.isTTY) {
    return { stream, wasTTY: true }
  }
  const ttyFd = fs.openSync('/dev/tty', 'r')
  return { stream: new tty.ReadStream(ttyFd), wasTTY: false }
}

export const waitForAnyKey = async (shouldReject) => {
  const { stream, wasTTY } = getTTY(process.stdin)

  await new Promise((res, rej) => {
    const handler = (d) => {
      stream.removeListener('data', handler)
      stream.setRawMode(false)
      stream.pause()
      const bytes = Array.from(d)
      if (bytes.length && shouldReject(bytes)) {
        return rej(new Error('Program quit by user'))
      }
      return res()
    }
    stream.resume()
    stream.setRawMode(true)
    stream.once('data', handler)
  })

  if (!wasTTY) {
    stream.destroy()
  }
}
