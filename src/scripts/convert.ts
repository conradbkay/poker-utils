import { genCardCombinations } from '../lib/utils.js'
import { resolve } from 'path'
import { initFromPathSync } from '../lib/init.js'
import { evaluate as eval2p2 } from '../lib/twoplustwo/evaluate.js'
import { cardsToPHE } from '../lib/phe/convert.js'
import { getPHEValue } from '../lib/phe/evaluate.js'

/*
 generates the `gapIdxs` values in lib/phe/convert.ts
 */

const allHands = genCardCombinations(5)
initFromPathSync(resolve('./HandRanks.dat'))

let hash: Record<number, number> = {}
let tptNs = new Set<number>()

for (const hand of allHands) {
  const tpt = eval2p2(hand).value
  const phe = getPHEValue(cardsToPHE(hand))
  if (phe in hash && hash[phe] !== tpt) {
    throw new Error('no direct comparison')
  }
  hash[phe] = tpt
  tptNs.add(tpt)
}

let curGap = -1
const gapIdxs = []

for (const key of Object.keys(hash).sort((a, b) => parseInt(a) - parseInt(b))) {
  const phe = parseInt(key)
  const gap = hash[key] - (7463 - phe)
  if (gap !== curGap) {
    curGap = gap
    gapIdxs.push([phe, gap])
  }
}

console.log(gapIdxs.reverse())

const sort = Array.from(tptNs).sort((a, b) => a - b)
const gaps = sort
  .filter((n, i) => i !== sort.length - 1 && n !== sort[i + 1] - 1)
  .map((n) => [n + 1, sort[sort.findIndex((compare) => compare > n)] - 1])

let g = 4096
const revGapIdxs = gaps.map((c, i) => {
  g += c[1] + 1 - c[0]
  return [c[0], g]
})

console.log([[0, 4096], ...revGapIdxs])
