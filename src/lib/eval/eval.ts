import { DECK } from './constants'
import { convertCardsToNumbers, evaluate } from './strength'

export const boardToInts = (board: string | number[]) => {
  if (typeof board !== 'string') {
    return board
  }

  const boardInts: number[] = []

  board = board.replaceAll(' ', '').toLowerCase()

  for (let i = 0; i < board.length; i += 2) {
    boardInts.push(DECK[board[i] + board[i + 1]])
  }

  return boardInts
}

export const strengthEval = (
  board: number[],
  handStr: string[],
  ranksFile: string
): number[] => {
  const hand = convertCardsToNumbers(handStr)

  return new Array(board.length - 2)
    .fill(0)
    .map(
      (_, i) => evaluate([...board.slice(0, i + 3), ...hand], ranksFile).value
    )
}
