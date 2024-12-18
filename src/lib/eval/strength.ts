import fs from 'fs'
import hash from './combinationsHash'
import { EvaluatedHand, HAND_TYPES } from './constants'

/**
 * some of this code is copied from https://github.com/Sukhmai/poker-evaluator
 * omaha is added, as well as passing a reference to the ranksData obj
 */

let RANKS_DATA = null

// in Omaha you need to use exactly 2 hole cards (and therefore 3 from the board)
export function evalOmaha(
  board: number[],
  holeCards: number[],
  ranksPath: string
): EvaluatedHand {
  if (!RANKS_DATA) {
    RANKS_DATA = fs.readFileSync(ranksPath)
  }

  const holeIdxsArr = hash[holeCards.length][2]
  const boardIdxsArr = hash[board.length][3]

  let max = { value: -Infinity } as EvaluatedHand

  for (const holeIdxs of holeIdxsArr) {
    for (const boardIdxs of boardIdxsArr) {
      const evaluated = evaluate(
        [
          holeCards[holeIdxs[0]],
          holeCards[holeIdxs[1]],
          board[boardIdxs[0]],
          board[boardIdxs[1]],
          board[boardIdxs[2]]
        ],
        ranksPath
      )

      if (evaluated.value > max.value) {
        max = evaluated
      }
    }
  }

  return max
}

export function evalCard(card: number): number {
  return RANKS_DATA.readUInt32LE(card * 4)
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
