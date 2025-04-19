import { genCardCombinations } from '@lib/utils'
import { resolve } from 'path'
import { initFromPathSync } from '@lib/init'
import { evaluate as eval2p2 } from '@lib/twoplustwo/strength'
import { evaluate } from '@lib/phe/evaluate'
import { cardsToPHE } from '@lib/phe/convert'

/*
 generates the `gapIdxs` values in lib/phe/convert.ts
 */

const allHands = genCardCombinations(5)
initFromPathSync(resolve('./HandRanks.dat'))

let hash: Record<number, number> = {}

for (const hand of allHands) {
  const tpt = eval2p2(hand).value
  const phe = evaluate(cardsToPHE(hand))
  if (phe in hash && hash[phe] !== tpt) {
    throw new Error('no direct comparison')
  } else {
    hash[phe] = tpt
  }
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
