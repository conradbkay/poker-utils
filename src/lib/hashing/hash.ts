import { any2 } from '../range/range.js'
import { flops } from './flops.js'
import { equityBuckets } from '../constants.js'
import { canonizeBoard } from '../iso.js'
import { closestIdx } from '../utils.js'
import { HoldemRange } from '../range/holdem.js'
import { formatCards } from '../cards/utils.js'

/**
 * Flops are the most computationally expensive to calculate equities for
 * There's only 1755 unique flops after applying isomorphism, so we can precompute every combo's equity vs a specific range for every flop
 */

/**
 * buckets all NLHE combos by equity. Assumes flop is already isomorphic
 *
 * passing chopReduction reduces equity into a single number rather than [win, tie, lose]
 *
 * it's tempting to convert flops into an iso index and then use a giant, flattened 1755x1326x23 uint16array and bypass json costs
 */
export const flopEquities = (
  flop: number[],
  vsRange: HoldemRange,
  chopReduction: 'win' | 'half' | 'skip' = 'skip'
) => {
  const hash: number[][] = new Array(1326)
    .fill(0)
    .map((_) => new Array(equityBuckets.length).fill(0))

  const range = HoldemRange.fromPokerRange(any2)

  const board = [...flop, undefined, undefined]
  // for bucketing we can consider turn and river sortable,
  for (let turn = 51; turn >= 1; turn--) {
    if (flop.includes(turn)) continue
    board[3] = turn
    for (let river = turn - 1; river >= 0; river--) {
      if (turn === river || flop.includes(river)) continue
      board[4] = river

      const result = range.equityVsRange({
        board,
        vsRange
      })

      for (let [combo, win, tie, lose] of result) {
        if (chopReduction) {
          win +=
            chopReduction === 'win'
              ? tie
              : chopReduction === 'half'
                ? tie / 2
                : 0
          tie = 0
        }

        const denom = win + tie + lose

        if (!denom) {
          continue // must be chop board with skip reduction, which doesn't fit well with any bucket. Maybe could be an argument to make it increment the 50% bucket
        }

        const eq = (win + tie) / denom
        const bucket = closestIdx(equityBuckets, eq * 100)
        hash[HoldemRange.getHandIdx(combo)][bucket] += 1
      }
    }
  }

  return hash
}

const flopToHashKey = (flop: number[]) =>
  formatCards(canonizeBoard(flop).cards).join('')

export const generateEquityHash = (vsRange: HoldemRange) => {
  const hash: RiverEquityHash = {}

  for (const [_, flop] of flops) {
    const equities = flopEquities(flop, vsRange)
    hash[flopToHashKey(flop)] = equities
  }

  return hash
}

export type EquityHash = {
  [board: string]: number[]
}
export type RiverEquityHash = {
  [board: string]: number[][] // same as above but instead of a general flop equity, every river is aggregated to the hash via some bucketing scheme so it doesn't end up crazy large
}

export const equityFromHash = <T extends RiverEquityHash | EquityHash>(
  hash: T,
  flop: number[],
  hand: number[]
): T[string][number] => {
  return hash[flopToHashKey(flop)][HoldemRange.getHandIdx(hand)]
}
