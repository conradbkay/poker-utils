import { any2, PokerRange } from '../range/range.js'
import { flops } from './flops.js'
import { equityBuckets } from '../constants.js'
import { isoRunouts, Runout, canonizeBoard } from '../iso.js'
import { closestIdx } from '../utils.js'
import { HoldemRange } from '../range/holdem.js'

/**
 * Flops are the most computationally expensive to calculate equities for
 * There's only 1755 unique flops after applying isomorphism, so we can precompute every combo's equity vs a specific range for every flop
 */

export const eachRiver = (
  flop: number[],
  f: (board: number[], iso: Runout) => void
) => {
  const isoFlop = canonizeBoard(flop).cards
  const runouts = isoRunouts(isoFlop)

  for (const turnStr in runouts) {
    const rivers = runouts[turnStr].children!
    const turn = parseInt(turnStr)
    for (const riverStr in rivers) {
      if (turnStr === riverStr) {
        console.log('err', turnStr, riverStr, flop, rivers, canonizeBoard(flop))
      }

      const isoInfo = rivers[riverStr]
      const river = parseInt(riverStr)
      const board = [...isoFlop, turn, river]

      f(board, isoInfo)
    }
  }
}

export const flopEquities = (
  flop: number[],
  vsPokerRange: PokerRange,
  chopIsWin: boolean = true
) => {
  const hash: number[][] = new Array(1326)
    .fill(0)
    .map((_) => new Array(equityBuckets.length).fill(0))

  eachRiver(flop, (board, { map, weight }) => {
    const range = HoldemRange.fromPokerRange(PokerRange.iso(any2, map))
    const vsRange = HoldemRange.fromPokerRange(
      PokerRange.iso(vsPokerRange, map)
    )

    const result = range.equityVsRange({
      board,
      vsRange
    })

    for (const [combo, win, tie, lose] of result) {
      const eq = (win + (chopIsWin ? tie : tie / 2)) / (win + tie + lose)
      const bucket = closestIdx(equityBuckets, eq * 100)
      hash[HoldemRange.getHandIdx(combo)][bucket] += weight
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
  [board: string]: number[][] // same as above but instead of a general flop equity, every river is aggregated to the hash via some bucketing scheme so it doesn't end up crazy large
}

export const equityFromHash = <T extends RiverEquityHash | EquityHash>(
  hash: T,
  board: number[],
  hand: number[]
): T['board'][0] => {
  return hash[canonizeBoard(board).cards.join(' ')][
    HoldemRange.getHandIdx(hand)
  ]
}
