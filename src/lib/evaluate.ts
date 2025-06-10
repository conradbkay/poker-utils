import { RANKS_DATA } from './init.js'
import { addGaps, cardsToPHE, valueFromPHE } from './phe/convert.js'
import { getPHEValue } from './phe/evaluate.js'
import { fastEval, finalP, pInfo } from './twoplustwo/strength.js'
import { evaluate as twoplustwoEval } from './twoplustwo/evaluate.js'

/** exact same input/output as twoplustwo algorithm */
export const phe = (cards: number[]) => {
  return addGaps(valueFromPHE(getPHEValue(cardsToPHE(cards))))
}

export const evaluate = (cards: number[]) =>
  RANKS_DATA ? twoplustwoEval(cards) : pInfo(phe(cards))

export const genBoardEval = (board: number[], evalFunc = fastEval) => {
  if (!RANKS_DATA) return (h: number[]) => evaluate([...board, ...h]).value

  let boardP = fastEval(board)
  return board.length === 5
    ? (hand: number[]) => evalFunc(hand, boardP)
    : (hand: number[]) => finalP(evalFunc(hand, boardP))
}
