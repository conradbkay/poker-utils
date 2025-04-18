import { boardToInts, deckWithoutSpecifiedCards } from '../eval/utils'
import { Range } from '../ranges'
import { flops } from './flops'
import { combosVsRangeAhead } from '../twoplustwo/equity'
import { equityBuckets } from '../constants'
import { isoBoard } from '../iso'
import { genCardCombinations, getHandIdx } from '@lib/utils'
/**
 * Flops are the most computationally expensive to calculate equities for
 * there's only 1755 unique flops after applying isomorphism, so we can precompute every combo's equity on every flop vs a specific range
 */

const allCombos = genCardCombinations(2)

const allCombosStrs = allCombos.map((c) => c.join(' '))

export const combosMap: { [key: string]: number } = {}

for (let i = 0; i < allCombosStrs.length; i++) {
  combosMap[allCombosStrs[i]] = i
}

const closestToIdx = (counts: number[], value: number) => {
  let result = Infinity
  let resultIdx = 0

  for (let i = 0; i < counts.length; i++) {
    const diff = Math.abs(counts[i] - value)

    if (diff < result) {
      result = diff
      resultIdx = i
    }
  }

  return resultIdx
}

// todo optional vsRange as 169 length isomorphic
export const flopEquities = (
  flop: string,
  vsRange: Range,
  ranksFile: string,
  chopIsWin: boolean = true
) => {
  const boardInts = boardToInts(flop)

  const deck = deckWithoutSpecifiedCards(boardInts)

  const hash: number[][] = new Array(1326)
    .fill(0)
    .map((_) => new Array(23).fill(0))

  const eqIdxCache: Record<number, number> = {}

  // todo can definitely speed this up by a lot
  // we could depend on isomorphic weights here because vsRange is based on preflop and should be identical across suits
  for (let k = 0; k < deck.length - 1; k++) {
    // 3s 2s runout is same as 2s 3s
    for (let m = k + 1; m < deck.length; m++) {
      const comboEqs = combosVsRangeAhead(
        [...boardInts, k, m],
        allCombos,
        vsRange,
        ranksFile,
        chopIsWin
      )

      for (const [combo, eq] of comboEqs) {
        const rnd = Math.round(eq * 10) / 10

        if (!(rnd in eqIdxCache)) {
          eqIdxCache[rnd] = closestToIdx(equityBuckets, rnd)
        }

        hash[getHandIdx(combo)][eqIdxCache[rnd]]++
      }
    }
  }

  return hash
}

export const generateEquityHash = (vsRange: Range, ranksFile: string) => {
  const hash: RiverEquityHash = {}

  for (const [flop] of flops) {
    const equities = flopEquities(flop, vsRange, ranksFile)
    hash[flop] = equities
  }

  return hash
}

export type EquityHash = {
  [board: string]: number[]
}

export type RiverEquityHash = {
  [board: string]: number[][] // same as above but instead of a general flop equity, every river is added to hash via some bucketing scheme
}

export const equityFromHash = <T extends RiverEquityHash | EquityHash>(
  hash: T,
  board: number[],
  hand: number[]
): T['board'][0] => {
  return hash[isoBoard(board).join(' ')][getHandIdx(hand)]
}
