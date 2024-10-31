import { isArray } from 'lodash'
import { DECK } from './constants'

export const getSuit = (card: number) => {
  return (card - 1) % 4
}

export const getRank = (card: number) => {
  return Math.floor((card - 1) / 4) + 2
}

export const getRankStr = (card: number) => {
  return [
    null,
    null,
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'T',
    'J',
    'Q',
    'K',
    'A'
  ][getRank(card)]
}

export const containsStraight = (board: number[]) => {
  const ranks = uniqueRanks(board).sort((a, b) => a - b)

  if (ranks.slice(0, 4).toString() === '2,3,4,5' && ranks.includes(14)) {
    return true
  }

  for (let start = 0; start <= ranks.length - 5; start++) {
    let gap = false

    for (let j = start; j < start + 4; j++) {
      if (ranks[j] + 1 !== ranks[j + 1]) {
        gap = true
      }
    }

    if (!gap) {
      return true
    }
  }

  return false
}

export const calcStraightOuts = (board: number[]): number => {
  let result = 0

  for (let i = 1; i <= 52; i += 4) {
    const hypothetical = [...board, i]

    if (containsStraight(hypothetical)) {
      result++
    }
  }

  return result
}

export const straightPossible = (board: number[]): boolean => {
  const helper = (ranks: number[]) => {
    if (ranks.length < 3) {
      return false
    }

    for (let i = 0; i < ranks.length - 2; i++) {
      if (ranks[i + 2] - ranks[i] <= 4) {
        return true
      }
    }

    return false
  }

  const ranks = uniqueRanks(board).sort((a, b) => a - b)

  if (helper(ranks)) {
    return true
  }

  return false
}

export const highCard = (board: number[]): number => {
  return Math.max(...board.map((card) => getRank(card)))
}

export const suitCount = (board: number[]): number => {
  return new Set(board.map((card) => getSuit(card))).size
}

export const suitCounts = (board: number[]): number[] => {
  return board.reduce(
    (accum, cur) => {
      accum[getSuit(cur)]++
      return accum
    },
    [0, 0, 0, 0]
  )
}

export const mostSuit = (board: number[]): number =>
  Math.max(...suitCounts(board))

export const uniqueRanks = (board: number[]): number[] => {
  return Array.from(new Set(board.map((c) => getRank(c))))
}

export const formatCard = (card: number) => {
  const key = Object.keys(DECK).find((k) => DECK[k] === card)

  return key[0].toUpperCase() + key[1]
}

export const formatCards = (cards: number[]) => cards.map(formatCard)

/**
 * Given a list of cards already dealt out, return the remaining cards that would be in the deck.
 */
export function deckWithoutSpecifiedCards(cards: number[]): number[] {
  const providedSet = new Set(cards)
  return Object.values(DECK).filter((name) => !providedSet.has(name))
}

/**
 * TS implementation of https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
 * Code based on: https://stackoverflow.com/a/12646864
 */
export function shuffleDeck(deck: number[]) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }

  return deck
}

export const boardToInts = (board: string | string[] | number[] | number) => {
  if (typeof board === 'number') {
    return board
  }

  if (isArray(board)) {
    return board.map((card) => boardToInts(card)).flat()
  }

  const boardInts: number[] = []

  board = board.replaceAll(' ', '').toLowerCase()

  for (let i = 0; i < board.length; i += 2) {
    boardInts.push(DECK[board[i] + board[i + 1]])
  }

  return boardInts
}
