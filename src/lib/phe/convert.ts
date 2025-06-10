import { c2str } from '../constants.js'
import { DECK } from '../constants.js'
import { stringifyCardCode, toCardCode } from './hand-code.js'

const _toPHE = (card: number) => toCardCode(c2str[card])
const _fromPHE = (code: number) => DECK[stringifyCardCode(code)]
export const toPHE = new Array(52).fill(0).map((_, i) => _toPHE(i))
export const fromPHE = new Array(52).fill(0).map((_, i) => _fromPHE(i))
export const cardsToPHE = (cards: number[]) => cards.map((c) => toPHE[c])
export const cardsFromPHE = (codes: number[]) => codes.map((c) => fromPHE[c])

// 0 -> 9, 1 -> 8, "type" as in idx of "three of a kind" etc
export const typeFromPHE = new Array(9).fill(0).map((_, i) => 9 - i)

/**
 * PHE goes from 1 (strongest) to 7462 (weakest)
 * this just reverses that order
 */
export const valueFromPHE = (evalN: number) => {
  return 7463 - evalN
}

// starting from x, how much we need to subtract
const subtractCutoffs = [
  [0, 4096],
  [5374, 6915],
  [11053, 8151],
  [13147, 11389],
  [17243, 14627],
  [20491, 18713],
  [25854, 21532],
  [28829, 25472],
  [32925, 29412]
]
/**
 * 2p2 eval skips certain ranges since they're used as locations in the lookup table
 */
export const removeGaps = (evalN: number) => {
  for (let i = subtractCutoffs.length - 1; i >= 0; i--) {
    if (evalN >= subtractCutoffs[i][0]) {
      return evalN - subtractCutoffs[i][1]
    }
  }

  throw new Error('invalid 2p2 value ' + evalN)
}

export const addGaps = (pheVal: number) => {
  for (let i = subtractCutoffs.length - 1; i > 0; i--) {
    const [cutoff, subtract] = subtractCutoffs[i]
    const pheStart = cutoff - subtractCutoffs[i - 1][1]
    // Calculate what the original number (evalN) would have been
    if (pheVal >= pheStart) {
      return pheVal + subtract
    }
  }

  return pheVal + 4096
}
