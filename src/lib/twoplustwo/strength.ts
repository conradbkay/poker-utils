import { hash } from '../cards/permuHash'
import { EvaluatedHand, HAND_TYPES } from '../twoplustwo/constants'
import { RANKS_DATA } from '../init'
import { evaluate } from '../../evaluate'

/**
 * todo the fastest solution is probably to store each board's p
 */
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

export function nextP(card: number): number {
  return RANKS_DATA.readUInt32LE(card * 4)
}

/**
 * ~1.3x faster than `evaluate`, but just returns `value`
 *
 * doesn't return the correct final values for 5/6 cards, use fastEvalPartial for that
 */
export const fastEval = (cards: number[], p = 53) => {
  for (const card of cards) {
    p = nextP(p + card)
  }

  return p
}

// can take 5-7 cards
export const fastEvalPartial = (cards: number[], p = 53) => {
  p = fastEval(cards, p)

  if (cards.length === 5 || cards.length === 6) {
    return nextP(p)
  }

  return p
}

// copied from https://github.com/Sukhmai/poker-evaluator
export const pInfo = (p: number) => ({
  handType: p >> 12,
  handRank: p & 0x00000fff,
  value: p,
  handName: HAND_TYPES[p >> 12]
})

export const genBoardEval = (board: number[], evalFunc = fastEval) => {
  if (!RANKS_DATA) return (h: number[]) => evaluate(h).value

  let boardP = fastEval(board)
  return board.length === 5
    ? (hand: number[]) => evalFunc(hand, boardP)
    : (hand: number[]) => nextP(evalFunc(hand, boardP))
}

// 2p2 eval only
export const genOmahaBoardEval = (board: number[]) => {
  const boardIdxsArr = hash[board.length][3]

  const boardPs = boardIdxsArr.map(([i1, i2, i3]) =>
    fastEval([board[i1], board[i2], board[i3]])
  )

  return (hand: number[]) => Math.max(...boardPs.map((p) => fastEval(hand, p)))
}
