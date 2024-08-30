import { convertCardsToNumbers, DECK, evaluate } from './strength'

export const boardToInts = (board: string) => {
  const boardInts: number[] = []

  for (let i = 0; i < board.length; i += 2) {
    boardInts.push(DECK[(board[i] + board[i + 1]).toLowerCase()])
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
