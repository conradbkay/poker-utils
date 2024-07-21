import {readFile} from 'fs/promises'

export let RANKS_DATA = null

export const init = async (ranksPath: string) => {
  RANKS_DATA = await readFile(ranksPath)
}