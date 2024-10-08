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

export const genAllCombos = () => {
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
  vsRange: Range,
  flops: [string, number][],
  ranksFile: string
) => {
  const hash: RiverEquityHash = {}

  for (const [flop] of flops) {
    const equities = flopEquities(flop, vsRange, ranksFile)
    hash[flop] = equities
  }

  return hash
}

export const hash = async (
  vsRange: Range,
  ranksFile: string,
  writePath: string
) => {
  const result = genEquityHash(vsRange, flops, ranksFile)

  await writeFile(writePath, JSON.stringify(result))
}

export type EquityHash = {
  [board: string]: number[][] // (high card [0-50]) -> (lower card [0-50])
}

export type RiverEquityHash = {
  [board: string]: number[][][] // same as above but instead of an equity, it's the 23 length buckets arr
}

export const equityFromHash = <T extends RiverEquityHash | EquityHash>(
  hash: T,
  board: number[],
  hand: number[]
): T['board'][0] => {
  const idxOfLarger = hand.indexOf(Math.max(...hand))

  const x = hand[idxOfLarger === 0 ? 1 : 0],
    y = hand[idxOfLarger]

  return hash[boardToUnique(board).join('')][combosMap[x - 2][y - 1]]
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

const suits = ['c', 'd', 'h', 's']

const genOffsuitPossible = () => {
  const result: string[] = []

  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < suits.length; j++) {
      if (i === j) {
        continue
      }

      result.push(suits[i] + suits[j])
    }
  }

  return result
}

const offsuitPossible = genOffsuitPossible()

const maxSuitsPerCard = (hand: number[], board: number[]) => {
  const boardSuits = board.map((c) => getSuit(c))

  return hand.map((card) => {
    const suit = getSuit(card)

    return boardSuits.filter((s) => s === suit).length
  })
}

// definitely a bad implementation, and even slightly inaccurate with respect to which cards match suits. Only works for 2 cards
export const handToUnique = (
  hand: number[],
  board: number[],
  origBoard: number[]
) => {
  hand = [...hand].sort((a, b) => b - a)

  const suited = getSuit(hand[0]) === getSuit(hand[1])

  const possibilities = suited ? ['ss', 'cc', 'hh', 'dd'] : offsuitPossible

  const matchedSuits = maxSuitsPerCard(hand, origBoard).join(' ')

  const valid = (cards: number[]) => {
    const newMatchSuits = maxSuitsPerCard(cards, board).join(' ')

    const dupe = board.includes(cards[0]) || board.includes(cards[1])

    const changedDraw =
      newMatchSuits !== matchedSuits &&
      newMatchSuits !== matchedSuits.split('').reverse().join('') // extra terrible

    return !dupe && !changedDraw
  }

  for (const possible of possibilities) {
    const newHand = hand.map(
      (h, i) => DECK[CARD_RANKS[getRank(h)] + possible[i]]
    )

    if (valid(newHand)) {
      return newHand
    }
  }

  throw new Error('could not make hand isomorphic')
}
