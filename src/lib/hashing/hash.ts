import { any2, PokerRange } from '../range/range.js'
import { flops } from './flops.js'
import { combosVsRangeAhead } from '../twoplustwo/equity.js'
import { equityBuckets } from '../constants.js'
import { flopIsoRunouts, getIsoBoard, isoRange, Runout } from '../iso.js'
import { closestIdx, genCardCombinations, getHandIdx } from '../utils.js'

/**
 * Flops are the most computationally expensive to calculate equities for
 * there's only 1755 unique flops after applying isomorphism, so we can precompute every combo's equity on every flop vs a specific range
 */

export const eachRiver = (
  flop: number[],
  f: (board: number[], iso: Runout) => void
) => {
  const runouts = flopIsoRunouts(flop)
  for (const turnStr in runouts) {
    const rivers = runouts[turnStr].children!
    const turn = parseInt(turnStr)
    for (const riverStr in rivers) {
      const isoInfo = rivers[riverStr]
      const river = parseInt(riverStr)
      const board = [...flop, turn, river]
      f(board, isoInfo)
    }
  }
}

export const flopEquities = (
  flop: number[],
  vsRange: PokerRange,
  chopIsWin: boolean = true
) => {
  const hash: number[][] = new Array(1326)
    .fill(0)
    .map((_) => new Array(23).fill(0))

  eachRiver(flop, (board, { map, weight }) => {
    const comboEqs = combosVsRangeAhead({
      board,
      range: isoRange(any2, map),
      vsRange: isoRange(vsRange, map),
      chopIsWin
    })

    for (const [combo, eq] of comboEqs) {
      const bucket = closestIdx(equityBuckets, eq * 100)
      hash[getHandIdx(combo)][bucket] += weight
    }
  })

  return hash
}

export const generateEquityHash = (vsRange: PokerRange) => {
  const hash: RiverEquityHash = {}

  for (const [s, flop] of flops) {
    const equities = flopEquities(flop, vsRange)
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
  return hash[getIsoBoard(board).join(' ')][getHandIdx(hand)]
}
