import { c2fstr, DECK } from '../twoplustwo/constants'

/**
 * these utils assume a deck from 1-52
 */

export const getSuit = (card: number) => {
  return (card - 1) % 4
}

// returns 2 for 2, 14 for ace
export const getRank = (card: number) => {
  return ((card - 1) >> 2) + 2
}

export const uniqueRanks = (board: number[]): number[] => {
  return Array.from(new Set(board.map((c) => getRank(c))))
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

/**
 * for textural analysis where you don't just want the strongest possible hand (a board could have a straight and a flush which returns true here)
 */
export const containsStraight = (board: number[]) => {
  const ranks = uniqueRanks(board).sort((a, b) => a - b)

  // wheel
  if (
    ranks[0] === 2 &&
    ranks[1] === 3 &&
    ranks[2] === 4 &&
    ranks[3] === 5 &&
    ranks[ranks.length - 1] === 14
  ) {
    return true
  }

  outer: for (let start = 0; start <= ranks.length - 5; start++) {
    for (let j = start; j < start + 4; j++) {
      if (ranks[j] + 1 !== ranks[j + 1]) {
        continue outer
      }
    }

    return true
  }

  return false
}

// returns 0, 4, 8, or # of remaining cards if board already has a straight
export const calcStraightOuts = (board: number[]): number => {
  if (containsStraight(board)) {
    return 52 - board.length
  }

  let result = 0

  // loop unique ranks since suits don't affect straights
  for (let i = 1; i <= 52; i += 4) {
    const hypothetical = [...board, i]

    if (containsStraight(hypothetical)) {
      result += 4 // we know all 4 suits aren't on the board if adding the rank creates a straight
    }
  }

  return result
}

// returns whether you can add 2 cards to the board to make a straight
export const straightPossible = (board: number[]): boolean => {
  const ranks = uniqueRanks(board).sort((a, b) => a - b)

  if (ranks.length < 3) return false

  // wheels
  if (
    ranks.filter((r) => r <= 5).length >= 2 &&
    ranks[ranks.length - 1] === 14
  ) {
    return true
  }

  for (let i = 0; i < ranks.length - 2; i++) {
    // [2, 4, 6] diff is 4
    if (ranks[i + 2] - ranks[i] <= 4) {
      return true
    }
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

/**
 * returns 'Ks', '9h' style formatted. empty string for unknown card
 */
export const formatCard = (card: number) => {
  return c2fstr[card] || ''
}

export const formatCards = (cards: number[]) => cards.map(formatCard)

export function deckWithoutSpecifiedCards(cards: number[]) {
  const providedSet = new Set(cards)
  return Object.values(DECK).filter((name) => !providedSet.has(name))
}

/**
 * TS implementation of https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
 * Code from https://stackoverflow.com/a/12646864
 */
export function shuffle(arr: number[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }

  return arr
}

export const boardToInts = (board: string | string[] | number[] | number) => {
  if (typeof board === 'number') {
    return board
  }

  if (Array.isArray(board)) {
    return board.map((card) => boardToInts(card)).flat()
  }

  const boardInts: number[] = []

  board = board.replaceAll(' ', '').toLowerCase()

  for (let i = 0; i < board.length; i += 2) {
    boardInts.push(DECK[board[i] + board[i + 1]])
  }

  return boardInts
}
