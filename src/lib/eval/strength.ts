import fs from 'fs'
import hash from './combinationsHash'

/**
 * most of this code is copied from https://github.com/Sukhmai/poker-evaluator
 */

export interface Deck {
  [key: string]: number
}

export const CARD_RANKS = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  't',
  'j',
  'q',
  'k',
  'a'
]

export const HAND_TYPES: HandName[] = [
  'invalid hand',
  'high card',
  'one pair',
  'two pairs',
  'three of a kind',
  'straight',
  'flush',
  'full house',
  'four of a kind',
  'straight flush'
]

export const DECK: Deck = {
  '2c': 1,
  '2d': 2,
  '2h': 3,
  '2s': 4,
  '3c': 5,
  '3d': 6,
  '3h': 7,
  '3s': 8,
  '4c': 9,
  '4d': 10,
  '4h': 11,
  '4s': 12,
  '5c': 13,
  '5d': 14,
  '5h': 15,
  '5s': 16,
  '6c': 17,
  '6d': 18,
  '6h': 19,
  '6s': 20,
  '7c': 21,
  '7d': 22,
  '7h': 23,
  '7s': 24,
  '8c': 25,
  '8d': 26,
  '8h': 27,
  '8s': 28,
  '9c': 29,
  '9d': 30,
  '9h': 31,
  '9s': 32,
  tc: 33,
  td: 34,
  th: 35,
  ts: 36,
  jc: 37,
  jd: 38,
  jh: 39,
  js: 40,
  qc: 41,
  qd: 42,
  qh: 43,
  qs: 44,
  kc: 45,
  kd: 46,
  kh: 47,
  ks: 48,
  ac: 49,
  ad: 50,
  ah: 51,
  as: 52
}

export const DECK_KEYS = new Set(Object.keys(DECK))
export const DECK_VALUES = new Set(Object.values(DECK))

export type HandName =
  | 'invalid hand'
  | 'high card'
  | 'one pair'
  | 'two pairs'
  | 'three of a kind'
  | 'straight'
  | 'flush'
  | 'full house'
  | 'four of a kind'
  | 'straight flush'

export interface EvaluatedHand {
  handType: number // Index of HANDTYPES array
  handRank: number
  value: number
  handName: HandName
}

export type PlayerOdds = {
  winRate: number
  splitRates: Split[]
}

export type TableOdds = {
  players: PlayerOdds[]
}

export type Split = {
  rate: number
  ways: number
}

let RANKS_DATA = null

// in Omaha you need to use exactly 2 hole cards (and therefore 3 from the board)
export function evalOmaha(
  board: number[],
  holeCards: number[],
  ranksPath: string
) {
  if (!RANKS_DATA) {
    RANKS_DATA = fs.readFileSync(ranksPath)
  }

  const holeIdxsArr = hash[holeCards.length][2]
  const boardIdxsArr = hash[board.length][3]

  let max = -Infinity
  let result: EvaluatedHand | null = null

  for (const holeIdxs of holeIdxsArr) {
    for (const boardIdxs of boardIdxsArr) {
      const evaluated = evaluate([
        holeCards[holeIdxs[0]],
        holeCards[holeIdxs[1]],
        board[boardIdxs[0]],
        board[boardIdxs[1]],
        board[boardIdxs[2]]
      ])

      if (evaluated.value > max) {
        max = evaluated.value
        result = evaluated
      }
    }
  }

  return result!
}

export function evalHand(
  cards: number[] | string[],
  ranksPath: string
): EvaluatedHand {
  if (!RANKS_DATA) {
    RANKS_DATA = fs.readFileSync(ranksPath)
  }

  if (cards.length < 5) {
    throw new Error(
      `Hand must be at least 5 cards, but ${cards.length} cards were provided`
    )
  }

  if (cardsAreValidNumbers(cards)) {
    return evaluate(cards as number[])
  } else if (cardsAreValidStrings(cards)) {
    const stringCards = cards as string[]

    return evaluate(convertCardsToNumbers(stringCards))
  } else {
    throw new Error(`
      Please supply input as a valid string[] | number[] of "cards".
    `)
  }
}

export function evalCard(card: number): number {
  return RANKS_DATA.readUInt32LE(card * 4)
}

export function convertCardsToNumbers(cards: string[]): number[] {
  return cards.map((card) => DECK[card.trim().toLowerCase()])
}

function cardsAreValidStrings(cards: string[] | number[]): boolean {
  return cards.every(
    (card: string | number) =>
      typeof card === 'string' && DECK_KEYS.has(card.toLowerCase())
  )
}

function cardsAreValidNumbers(cards: string[] | number[]): boolean {
  return cards.every(
    (card: string | number) => typeof card === 'number' && DECK_VALUES.has(card)
  )
}

export function evaluate(
  cardValues: number[],
  ranksPath?: string
): EvaluatedHand {
  if (!RANKS_DATA && ranksPath) {
    RANKS_DATA = fs.readFileSync(ranksPath)
  }

  let p = 53
  cardValues.forEach((cardValue) => (p = evalCard(p + cardValue)))

  if (cardValues.length === 5 || cardValues.length === 6) {
    p = evalCard(p)
  }

  return {
    handType: p >> 12,
    handRank: p & 0x00000fff,
    value: p,
    handName: HAND_TYPES[p >> 12]
  }
}

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
}
