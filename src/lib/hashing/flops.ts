import { genCardCombinations } from '@lib/utils'
import { isoBoard, isoWeight } from '../iso'
import { c2fstr } from '@lib/twoplustwo/constants'

const seen = new Set<string>()
// exported for testing
export const allFlops = genCardCombinations(3)
export const flopIsoBoards = allFlops.reduce((a, c) => {
  const iso = isoBoard(c)
  if (!seen.has(iso.toString())) {
    seen.add(iso.toString())
    a.push(iso)
  }

  return a
}, [] as number[][])

// [formatted, cards[], weight]
export const flops = flopIsoBoards
  .reverse()
  .map(
    (flop) =>
      [flop.map((card) => c2fstr[card]).join(''), flop, isoWeight(flop)] as [
        string,
        number[],
        number
      ]
  )
