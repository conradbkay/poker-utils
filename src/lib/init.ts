export let RANKS_DATA = null
let usedPath: string | null = null // file never changes so don't load it more than once

export const initFromPath = async (path: string) => {
  try {
    const { readFile } = await require('fs/promises')

    if (path && path !== usedPath) {
      RANKS_DATA = await readFile(path)
      usedPath = path
    }
  } catch (err) {
    console.error('could not initialize HandRanks')
  }
}

export const initFromPathSync = (path: string) => {
  require('fs').then(({ readFileSync }) => {
    if (path && path !== usedPath) {
      RANKS_DATA = readFileSync(path)
      usedPath = path
    }
  })
}

export const init = (data: Buffer) => {
  RANKS_DATA = data
}
