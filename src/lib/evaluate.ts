import { hash } from './cards/permuHash'
import { RANKS_DATA } from './init'
import { addGaps, cardsToPHE, valueFromPHE } from './phe/convert'
import { getPHEValue } from './phe/evaluate'
import { EvaluatedHand } from './twoplustwo/constants'
import { fastEval, finalP, twoplustwoEvaluate } from './twoplustwo/strength'
import { pInfo } from './twoplustwo/strength'

/** exact same input/output as twoplustwo algorithm */
export const phe = (cards: number[]) => {
  return addGaps(valueFromPHE(getPHEValue(cardsToPHE(cards))))
}

export const evaluate = (cards: number[]) =>
  RANKS_DATA ? twoplustwoEvaluate(cards) : pInfo(phe(cards))

export const genBoardEval = (board: number[], evalFunc = fastEval) => {
  if (!RANKS_DATA) return (h: number[]) => evaluate([...board, ...h]).value

  let boardP = fastEval(board)
  return board.length === 5
    ? (hand: number[]) => evalFunc(hand, boardP)
    : (hand: number[]) => finalP(evalFunc(hand, boardP))
}

export const evalOmaha = (
  board: number[],
  holeCards: number[]
): EvaluatedHand => {
  // in Omaha you need to use exactly 2 hole cards and therefore 3 from the board
  const holeIdxsArr = hash[holeCards.length][2]
  const boardIdxsArr = hash[board.length][3]

  let max = -Infinity

  for (const boardIdxs of boardIdxsArr) {
    const handEval = genBoardEval([
      board[boardIdxs[0]],
      board[boardIdxs[1]],
      board[boardIdxs[2]]
    ])

    for (const holeIdxs of holeIdxsArr) {
      const p = handEval([holeCards[holeIdxs[0]], holeCards[holeIdxs[1]]])

      if (p > max) {
        max = p
      }
    }
  }

  return pInfo(max)
}
