import { RANKS_DATA } from './init'
import { addGaps, cardsToPHE, valueFromPHE } from './phe/convert'
import { getPHEValue } from './phe/evaluate'
import { fastEval, finalP, pInfo } from './twoplustwo/strength'
import { evaluate as twoplustwoEval } from './twoplustwo/evaluate'

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
