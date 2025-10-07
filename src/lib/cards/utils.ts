import { c2str, CARDS } from '../constants'
import { DECK } from '../constants'

/**
 * these utils assume a deck from 0-51
 */

/** returns 0-3 */
export const getSuit = (card: number) => card & 3

/** returns 0 for 2, 12 for ace */
export const getRank = (card: number) => card >> 2

const MIN_RANK = getRank(DECK['2s'])
const ACE_RANK = getRank(DECK['As'])

/** returns array of ranks */
export const uniqueRanks = (board: number[]) =>
  Array.from(new Set(board.map((c) => getRank(c))))

export const makeCard = (rank: number, suit: number) => (rank << 2) | suit

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
    ranks[0] === 0 &&
    ranks[1] === 1 &&
    ranks[2] === 2 &&
    ranks[3] === 3 &&
    ranks[ranks.length - 1] === ACE_RANK
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

/** returns 0, 4, 8. 0 if board already is a straight */
export const calcStraightOuts = (board: number[]) => {
  if (containsStraight(board)) {
    return 0
  }

  let result = 0

  // loop unique ranks since suits don't affect straights
  for (let i = 0; i < 52; i += 4) {
    const hypothetical = [...board, i]

    if (containsStraight(hypothetical)) {
      result += 4 // we know all 4 suits aren't on the board if adding the rank creates a straight
    }
  }

  return result
}

// from script ran from ../hashing/flops.ts
const nonOesdFlopRanks = [
  '0',
  '1',
  '0,1,2',
  '2',
  '0,1,3',
  '0,2,3',
  '1,2,3',
  '3',
  '0,4',
  '0,1,4',
  '0,2,4',
  '1,2,4',
  '0,3,4',
  '1,3,4',
  '2,3,4',
  '4',
  '0,5',
  '1,5',
  '1,2,5',
  '1,3,5',
  '2,3,5',
  '1,4,5',
  '2,4,5',
  '3,4,5',
  '5',
  '0,6',
  '1,6',
  '2,6',
  '2,3,6',
  '2,4,6',
  '3,4,6',
  '2,5,6',
  '3,5,6',
  '4,5,6',
  '6',
  '0,7',
  '1,7',
  '2,7',
  '3,7',
  '3,4,7',
  '3,5,7',
  '4,5,7',
  '3,6,7',
  '4,6,7',
  '5,6,7',
  '7',
  '0,8',
  '1,8',
  '2,8',
  '3,8',
  '0,4,8',
  '4,8',
  '4,5,8',
  '4,6,8',
  '5,6,8',
  '4,7,8',
  '5,7,8',
  '6,7,8',
  '8',
  '0,9',
  '1,9',
  '2,9',
  '3,9',
  '0,4,9',
  '4,9',
  '0,5,9',
  '1,5,9',
  '5,9',
  '5,6,9',
  '5,7,9',
  '6,7,9',
  '5,8,9',
  '6,8,9',
  '7,8,9',
  '9',
  '0,10',
  '1,10',
  '2,10',
  '3,10',
  '0,4,10',
  '4,10',
  '0,5,10',
  '1,5,10',
  '5,10',
  '0,6,10',
  '1,6,10',
  '2,6,10',
  '6,10',
  '6,7,10',
  '6,8,10',
  '7,8,10',
  '6,9,10',
  '7,9,10',
  '8,9,10',
  '10',
  '0,11',
  '1,11',
  '2,11',
  '3,11',
  '0,4,11',
  '4,11',
  '0,5,11',
  '1,5,11',
  '5,11',
  '0,6,11',
  '1,6,11',
  '2,6,11',
  '6,11',
  '0,7,11',
  '1,7,11',
  '2,7,11',
  '3,7,11',
  '7,11',
  '7,8,11',
  '7,9,11',
  '8,9,11',
  '7,10,11',
  '8,10,11',
  '9,10,11',
  '11',
  '0,12',
  '0,1,12',
  '1,12',
  '0,2,12',
  '1,2,12',
  '2,12',
  '0,3,12',
  '1,3,12',
  '2,3,12',
  '3,12',
  '0,4,12',
  '4,12',
  '0,5,12',
  '5,12',
  '0,6,12',
  '1,6,12',
  '2,6,12',
  '6,12',
  '0,7,12',
  '1,7,12',
  '2,7,12',
  '3,7,12',
  '7,12',
  '0,8,12',
  '1,8,12',
  '2,8,12',
  '3,8,12',
  '4,8,12',
  '8,12',
  '0,9,12',
  '1,9,12',
  '2,9,12',
  '3,9,12',
  '4,9,12',
  '5,9,12',
  '8,9,12',
  '9,12',
  '0,10,12',
  '1,10,12',
  '2,10,12',
  '3,10,12',
  '4,10,12',
  '5,10,12',
  '8,10,12',
  '9,10,12',
  '10,12',
  '0,11,12',
  '1,11,12',
  '2,11,12',
  '3,11,12',
  '4,11,12',
  '5,11,12',
  '6,11,12',
  '7,11,12',
  '8,11,12',
  '9,11,12',
  '10,11,12',
  '11,12',
  '12'
]

/* returns false is straight already possible  */
export const oesdPossible = (board: number[]) => {
  const ranks = uniqueRanks(board).sort((a, b) => a - b)
  if (board.length === 3) {
    return !nonOesdFlopRanks.includes(ranks.join(','))
  }

  if (straightPossible(board)) {
    return false
  }

  if (ranks.length < 2) return false
  // Try all rank pairs (including pairs) for hole cards.
  for (let r1 = MIN_RANK; r1 <= ACE_RANK; r1++) {
    for (let r2 = r1; r2 <= ACE_RANK; r2++) {
      const c1 = makeCard(r1, 0)
      const c2 = makeCard(r2, r1 === r2 ? 1 : 0)
      const hypothetical = [...board, c1, c2]

      if (calcStraightOuts(hypothetical) === 8) {
        return true
      }
    }
  }

  return false
}

// returns whether you can add 2 cards to the board to make a straight
export const straightPossible = (board: number[]) => {
  const ranks = uniqueRanks(board).sort((a, b) => a - b)

  if (ranks.length < 3) return false

  // wheels
  if (
    ranks.filter((r) => r <= getRank(DECK['5s'])).length >= 2 &&
    ranks[ranks.length - 1] === ACE_RANK
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

export const boardToInts = (board: string | string[] | number[]): number[] => {
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

export const randUniqueCards = (count: number) => {
  if (count > 10) {
    return shuffle([...CARDS]).slice(0, count)
  }

  let result: number[] = []

  while (result.length < count) {
    let next = Math.floor(Math.random() * 52)
    if (!result.includes(next)) {
      result.push(next)
    }
  }

  return result
}
