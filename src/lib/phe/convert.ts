import { c2fstr, DECK } from '../twoplustwo/constants'
import { stringifyCardCode, toCardCode } from './hand-code'
import { getPHEValue } from './evaluate'
import { pInfo } from '../twoplustwo/strength'

const _toPHE = (card: number) => toCardCode(c2fstr[card])
const _fromPHE = (code: number) => DECK[stringifyCardCode(code).toLowerCase()]
export const toPHE = new Array(53).fill(0).map((_, i) => (i ? _toPHE(i) : -1))
export const fromPHE = new Array(52).fill(0).map((_, i) => _fromPHE(i))
export const cardsToPHE = (cards: number[]) => cards.map((c) => toPHE[c])
export const cardsFromPHE = (codes: number[]) => codes.map((c) => fromPHE[c])

// 0 -> 9, 1 -> 8
export const typeFromPHE = new Array(9).fill(0).map((_, i) => 9 - i)

const gapIdxs = [
  [6186, 4096],
  [3326, 6915],
  [2468, 8151],
  [1610, 11389],
  [1600, 14627],
  [323, 18713],
  [167, 21532],
  [11, 25472],
  [1, 29412]
] // from scripts/convert.ts

/**
 * PHE goes from 1 (strongest) to 7462 (weakest)
 *
 * 2p2 goes from 4097 (weakest) to 36874 (strognest)
 *
 * this returns 4097 to 36874 from the PHE val
 */
export const valueFromPHE = (evalN: number) => {
  for (let i = 0; i < gapIdxs.length; i++) {
    if (evalN >= gapIdxs[i][0]) {
      return 7463 - evalN + gapIdxs[i][1]
    }
  }

  throw new Error('invalid PHE value')
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
