/* for now this file is just a few utilities for 4 card omaha, since PokerRange is usable for storing 4-6 card omaha ranges */

import { hash } from '../cards/permuHash'
import { getRank, getSuit } from '../cards/utils'
import { RANKS } from '../constants'

/**
 * converts to "AKQ9ds"/ss/r representation
 * for PLO6 can return 'ts' for triple suited
 */
export const omahaToIsoPre = (hand: number[]) => {
  const ranks = hand.map((c) => getRank(c))
  const suits = hand.map((c) => getSuit(c))

  const flushSuitCount = [0, 1, 2, 3].filter(
    (suit) => suits.filter((s) => s === suit).length >= 2
  ).length

  const sortedRankStr = ranks
    .sort((a, b) => b - a)
    .map((r) => RANKS[r])
    .join('')

  const flushStr = ['r', 'ss', 'ds', 'ts'][flushSuitCount]

  return sortedRankStr + flushStr
}

// returns all unique 2 card combos from an omaha hand
export const omahaConstituentCombos = (hand: number[]) => {
  const result: number[][] = []

  const indicesArr = hash[hand.length][2]

  for (const indices of indicesArr) {
    const useHand = indices.map((idx) => hand[idx])
    result.push(useHand)
  }

  return result
}
