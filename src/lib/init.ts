import { readFileSync } from 'fs'
import { readFile } from 'fs/promises'

export let RANKS_DATA = null
let usedPath: string | null = null // file never changes so don't load it more than once
let defaultPath = null

export const lazyInitFromPath = (path: string) => {
  defaultPath = path
}

export const initFromPath = async (path?: string) => {
  path = path || defaultPath

  if (path && path !== usedPath) {
    RANKS_DATA = await readFile(path)
    usedPath = path
  }
}

export const initFromPathSync = (path?: string) => {
  path = path || defaultPath

  if (path && path !== usedPath) {
    RANKS_DATA = readFileSync(path)
    usedPath = path
  }
}

export const init = (data: Buffer) => {
  RANKS_DATA = data
}
