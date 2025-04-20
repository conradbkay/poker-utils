import { Range } from '../ranges/ranges.js'
import { flops } from './flops.js'
import { combosVsRangeAhead } from '../twoplustwo/equity.js'
import { equityBuckets } from '../constants.js'
import { flopIsoRunouts, isoBoard, makeCard, Runout } from '../iso.js'
import { closestIdx, genCardCombinations, getHandIdx } from '../utils.js'
import { getRank, getSuit } from '../cards/utils.js'
import { c2fstr } from '../twoplustwo/constants.js'

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

// todo several combos will map to the same iso so group them together with a 'weight'
export const rangeToIso = (range: number[][], map: number[]) => {
  let baseStart = map.findLastIndex((v) => v === -1)
  return range.map((cards) => {
    let nextSuit = baseStart

    return cards.map((card) => {
      const s = getSuit(card)
      const r = getRank(card)
      if (map[s] === -1) {
        map[s] = nextSuit
        nextSuit--
      }
      return makeCard(r, map[s])
    })
  })
}

const allCombos = genCardCombinations(2)
// todo optional vsRange as 169 length isomorphic
export const flopEquities = (
  flop: number[],
  vsRange: Range,
  ranksFile?: string,
  chopIsWin: boolean = true
) => {
  const fstr = flop.map((c) => c2fstr[c]).join('')
  const hash: number[][] = new Array(1326)
    .fill(0)
    .map((_) => new Array(23).fill(0))

  // maybe it's possible to reduce each range by the intersection somehow?
  eachRiver(flop, (board, { map, weight }) => {
    const comboEqs = combosVsRangeAhead({
      board,
      range: rangeToIso(allCombos, map),
      vsRange: rangeToIso(vsRange, map),
      ranksFile,
      chopIsWin
    })

    for (const [combo, eq] of comboEqs) {
      const bucket = closestIdx(equityBuckets, eq)
      hash[getHandIdx(combo)][bucket] += weight
    }
  })

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
