import { genCardCombinations } from '../lib/utils'
import { resolve } from 'path'
import { initFromPathSync } from '../lib/init'
import { evaluate as eval2p2 } from '../lib/twoplustwo/evaluate'

const allHands = genCardCombinations(5)
initFromPathSync(resolve('./HandRanks.dat'))

let tptNs = new Set<number>()

for (const hand of allHands) {
  const tpt = eval2p2(hand).value
  tptNs.add(tpt)
}

const sort = Array.from(tptNs).sort((a, b) => a - b)
const gaps = sort
  .filter((n, i) => i !== sort.length - 1 && n !== sort[i + 1] - 1)
  .map((n) => [n + 1, sort[sort.findIndex((compare) => compare > n)] - 1])

let g = 4096
const revGapIdxs = gaps.map((c) => {
  g += c[1] + 1 - c[0]
  return [c[0], g]
})

console.log([[0, 4096], ...revGapIdxs])
