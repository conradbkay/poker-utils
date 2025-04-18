import { genCardCombinations } from '@lib/utils'
import { isoBoard, isoWeight } from '../iso'
import { c2fstr, c2str } from '@lib/twoplustwo/constants'

const allFlops = genCardCombinations(3)
const seen = new Set<string>()
// exported for testing
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
