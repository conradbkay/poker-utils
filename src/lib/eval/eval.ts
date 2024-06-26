import { convertCardsToNumbers, evaluate } from './strength'

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
