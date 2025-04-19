import { deckWithoutSpecifiedCards } from '../cards/utils'
import { Range, ranges } from '../ranges'
import { flops } from './flops'
import { combosVsRangeAhead } from '../twoplustwo/equity'
import { equityBuckets } from '../constants'
import { flopIsoRunouts, isoBoard } from '../iso'
import { closestIdx, genCardCombinations, getHandIdx } from '@lib/utils'

/**
 * Flops are the most computationally expensive to calculate equities for
 * there's only 1755 unique flops after applying isomorphism, so we can precompute every combo's equity on every flop vs a specific range
 */

const allCombos = genCardCombinations(2)
// todo optional vsRange as 169 length isomorphic
export const flopEquities = (
  flop: number[],
  vsRange: Range,
  ranksFile?: string,
  chopIsWin: boolean = true
) => {
  const hash: number[][] = new Array(1326)
    .fill(0)
    .map((_) => new Array(23).fill(0))

  const runouts = flopIsoRunouts(flop)
  // maybe it's possible to reduce each range by the intersection somehow?
  // ! we need to convert allCombos and vsRange to the isomorphic hand with weight for each turn/river
  for (const turnStr in runouts) {
    const rivers = runouts[turnStr]
    const turn = parseInt(turnStr)
    for (const riverStr in rivers) {
      const weight = rivers[riverStr]
      const river = parseInt(riverStr)
      const comboEqs = combosVsRangeAhead({
        board: [...flop, turn, river],
        range: allCombos,
        vsRange,
        ranksFile,
        chopIsWin
      })

      for (const [combo, eq] of comboEqs) {
        const bucket = closestIdx(equityBuckets, eq)
        hash[getHandIdx(combo)][bucket] += weight
      }
    }
  }

  /*
  for (let k = 1; k < deck.length - 1; k++) {
    // 3s 2s runout is same as 2s 3s
    for (let m = k + 1; m < deck.length; m++) {
    }
  }
  */
  return hash
}

export const generateEquityHash = (vsRange: Range, ranksFile: string) => {
  const hash: RiverEquityHash = {}

  for (const [s, flop] of flops) {
    const equities = flopEquities(flop, vsRange, ranksFile)
    hash[s] = equities
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
