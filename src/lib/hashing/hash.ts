import { any2 } from '../range/range'
import { flops } from './flops'
import { equityBuckets } from '../constants'
import { canonizeBoard, iso } from '../iso'
import { closestIdx } from '../utils'
import { HoldemRange } from '../range/holdem'
import { formatCards } from '../cards/utils'

/**
 * Flops are the most computationally expensive to calculate equities for
 * There's only 1755 unique flops after applying isomorphism, so we can precompute every combo's equity vs a specific range for every flop
 */

/**
 * buckets all NLHE combos by equity. Assumes flop is already isomorphic
 *
 * it's tempting to convert flops into an iso index and then use a giant, flattened 1755x1326x23 uint16array and bypass json costs
 *
 * todo make this more general to allow for things like storing [win, tie, lose] aggregate, or bucketing into percentiles of range rather than equity
 */
export const flopEquities = (
  flop: number[],
  vsRange: HoldemRange,
  chopReduction: 'win' | 'half' | 'skip' = 'skip'
) => {
  const hash: number[][] = new Array(1326)

  // hands that collide with flop should remain undefined to conserve space
  for (let idx = 0; idx < 1326; idx++) {
    const combo = HoldemRange.fromHandIdx(idx)
    if (combo.some((c) => flop.includes(c))) continue
    hash[idx] = new Array(equityBuckets.length).fill(0)
  }

  const range = HoldemRange.fromPokerRange(any2)

  const board = [...flop, undefined, undefined]
  // for bucketing we can consider turn and river sortable. That is, there's no need to do 43,30 and 30,43 since they're equivalent and ranges stay fixed
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
        win +=
          chopReduction === 'win' ? tie : chopReduction === 'half' ? tie / 2 : 0

        const denom = win + lose

        if (!denom) {
          continue // must be chop board with skip reduction, which doesn't fit well with any bucket. Maybe could be an argument to make it increment the 50% bucket
        }

        const eq = win / denom
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
  const { board, hand: isoHand } = iso({ board: flop, hand })
  return hash[flopToHashKey(board)][HoldemRange.getHandIdx(isoHand)]
}
