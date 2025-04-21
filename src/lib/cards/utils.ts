import { c2str } from 'lib/constants.js'
import { DECK } from 'lib/constants.js'

/**
 * these utils assume a deck from 1-52
 */

/** returns 0-3 */
export const getSuit = (card: number) => (card - 1) % 4

/** returns 2 for 2, 14 for ace */
export const getRank = (card: number) => ((card - 1) >> 2) + 2

export const uniqueRanks = (board: number[]) =>
  Array.from(new Set(board.map((c) => getRank(c))))

export const makeCard = (rank: number, suit: number) =>
  (rank - 2) * 4 + suit + 1

/** for non user-facing purposes where dealing with str is easier than arr */
export const cardsStr = (cards: number[]) => cards.join(',')
export const fromCardsStr = (str: string) =>
  str.split(',').map((s) => parseInt(s)) // .map(parseInt) would pass index as second param which is radix (base)

/**
 * returns 'Ks', '9h' style formatted. empty string for unknown card
 */
export const formatCard = (card: number) => c2str[card] || ''
export const formatCards = (cards: number[]) => cards.map(formatCard)

export const suitCount = (cards: number[]) =>
  new Set(cards.map((c) => getSuit(c))).size

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
export const calcStraightOuts = (board: number[]) => {
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
export const straightPossible = (board: number[]) => {
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

export const highCard = (board: number[]) => Math.max(...board.map(getRank))

export const suitCounts = (board: number[]) => {
  return board.reduce(
    (accum, cur) => {
      accum[getSuit(cur)]++
      return accum
    },
    [0, 0, 0, 0]
  )
}

export const mostSuit = (board: number[]) => Math.max(...suitCounts(board))

export const deckWithoutSpecifiedCards = (cards: number[]) => {
  const used = new Set(cards)
  return Object.values(DECK).filter((name) => !used.has(name))
}

/**
 * TS implementation of https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
 * Code from https://stackoverflow.com/a/12646864
 */
export const shuffle = (arr: number[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }

  return arr
}

export const boardToInts = (board: string | string[] | number[]) => {
  if (Array.isArray(board)) {
    return board.map((card) => boardToInts(card)).flat()
  }

  const boardInts: number[] = []

  board = board.replaceAll(' ', '')

  for (let i = 0; i < board.length; i += 2) {
    boardInts.push(DECK[board[i].toUpperCase() + board[i + 1].toLowerCase()])
  }

  return boardInts
}
