import { writeFile } from 'fs/promises'

import { flopEquities } from '../eval/equity'
import { getRank, getRankStr, getSuit, mostSuit } from '../eval/utils'

import { Range } from '../ranges'

import { flops } from './flops'
import { CARD_RANKS, DECK } from '../eval/strength'

/**
 * Flops are the most computationally expensive to calculate equities for
 * But there's only 1755 unique flops so we can precompute every combo's equity on every flop vs a range
 */

const genAllCombos = () => {
  const result: number[][] = []

  for (let i = 1; i <= 51; i++) {
    for (let j = i + 1; j <= 52; j++) {
      result.push([j, i])
    }
  }

  return result
}

const allCombos = genAllCombos()

const allCombosStrs = allCombos.map((c) => c.join(' '))

export const combosMap: { [key: string]: number } = {}

for (let i = 0; i < allCombosStrs.length; i++) {
  combosMap[allCombosStrs[i]] = i
}

const genEquityHash = (
  range: number[][],
  vsRange: number[][],
  flops: [string, number][],
  ranksFile: string
) => {
  const hash: EquityHash = {}

  for (const [flop] of flops) {
    const equities = flopEquities(flop, range, vsRange, ranksFile)
    hash[flop] = equities
  }

  return hash
}

export const hash = async (
  range: Range,
  ranksFile: string,
  writePath: string
) => {
  const result = genEquityHash(allCombos, range, flops, ranksFile)

  await writeFile(writePath, JSON.stringify(result))
}

export type EquityHash = {
  [board: string]: number[]
}

export const equityFromHash = (
  hash: EquityHash,
  board: number[],
  hand: number[]
) => {
  const idxOfLarger = hand.indexOf(Math.max(...hand))

  const x = hand[idxOfLarger === 0 ? 1 : 0],
    y = hand[idxOfLarger]

  return hash[boardToUnique(board).join('')][combosMap[y + ' ' + x]]
}

// follows pio strategically unique grouping
export const boardToUnique = (board: number[]) => {
  const sorted = [...board].sort((a, b) => b - a)

  const mostSuits = mostSuit(board)

  let suitMap = ['s', 's', 's']

  if (mostSuits === 1) {
    suitMap = ['s', 'h', 'd']
  } else if (mostSuits === 2) {
    if (getSuit(sorted[1]) === getSuit(sorted[0])) {
      suitMap = ['s', 's', 'h']
    } else if (getSuit(sorted[1]) === getSuit(sorted[2])) {
      suitMap =
        getRank(sorted[0]) === getRank(sorted[1])
          ? ['s', 'h', 's']
          : ['s', 'h', 'h']
    } else {
      suitMap =
        getRank(sorted[1]) === getRank(sorted[2])
          ? ['s', 's', 'h']
          : ['s', 'h', 's']
    }
  }

  const result = sorted.map((s, i) => getRankStr(s) + suitMap[i])

  return result
}

// definitely a bad implementation, and even slightly inaccurate with respect to which cards match suits
export const handToUnique = (
  hand: number[],
  board: number[],
  origBoard: number[]
) => {
  const valid = (card: number) => {
    const suit = getSuit(card)

    const matchedSuits = origBoard.filter((c) => getSuit(c) === suit)
    const newMatchSuits = board.filter((c) => getSuit(c) === suit)

    const dupe = board.includes(card)
    const changedDraw = newMatchSuits !== matchedSuits

    return !dupe && !changedDraw
  }

  const result: number[] = []

  for (const card of hand) {
    const rankStr = CARD_RANKS[getRank(card)]

    for (const suit of ['c', 'd', 'h', 's']) {
      const edited = DECK[rankStr + suit]
      if (valid(edited)) {
        result.push(edited)
      }
    }
  }

  if (result.length < 2) {
    throw new Error('could not make card isomorphic')
  }

  return result
}
