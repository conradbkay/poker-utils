export let RANKS_DATA: Buffer | null = null
let usedPath: string | null = null // file never changes so don't load it more than once

export const initFromPath = async (path: string) => {
  try {
    if (path && path !== usedPath) {
      const { readFile } = await import('fs/promises')
      RANKS_DATA = await readFile(path)
      usedPath = path
    }
  } catch (err) {
    console.error(
      'could not initialize HandRanks - likely running in browser environment'
    )
  }
}

export const initFromPathSync = (path: string) => {
  try {
    if (path && path !== usedPath) {
      // Dynamic require to avoid bundling fs in browser builds
      const fs = (function () {
        return require('fs')
      })()
      RANKS_DATA = fs.readFileSync(path)
      usedPath = path
    }
  } catch (err) {
    console.error(
      'could not initialize HandRanks - likely running in browser environment'
    )
  }
}

export const init = (data: Buffer) => {
  RANKS_DATA = data
}
