import fs from 'node:fs'

export let RANKS_DATA: Buffer | null = null
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
  try {
    if (fs && path && path !== usedPath) {
      RANKS_DATA = fs.readFileSync(path)
      usedPath = path
    }
  } catch (err) {
    console.error('could not initialize HandRanks')
  }
}

export const init = (data: Buffer) => {
  RANKS_DATA = data
}
