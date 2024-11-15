import {
  EquityHash,
  RiverEquityHash,
  boardToUnique,
  equityFromHash,
  handToUnique
} from '../hashing/hash'
import { plo5Range, ploRange } from '../ranges'
import { DECK } from './constants'
import { evalOmaha, evaluate } from './strength'

type Range = number[][]

export type EvalOptions = {
  board: number[]
  hand: number[]
  flopHash?: EquityHash | RiverEquityHash
  ranksFile: string
  chopIsWin?: boolean
}

// returns equity for every river, or whatever is inside the flop hash
export const equityEval = ({
  board,
  hand,
  flopHash,
  ranksFile,
  vsRange,
  chopIsWin
}: EvalOptions & { vsRange: Range }) => {
  const result: number[] = []

  if (board.length === 3) {
    if (flopHash) {
      const isoBoard = boardToUnique(board.slice(0, 3)).map(
        (s) => DECK[s.toLowerCase()]
      )

      const isoHand = handToUnique(hand, isoBoard, board.slice(0, 3))

      return equityFromHash(flopHash, isoBoard, isoHand)
    } else {
      for (let j = 1; j <= 52; j++) {
        if (board.includes(j)) {
          continue
        }
        result.push(
          ...(equityEval({
            hand,
            ranksFile,
            vsRange,
            chopIsWin,
            board: [...board, j]
          }) as number[])
        )
      }
    }
  } else if (board.length === 4) {
    const turnCards = new Set(board)

    const evalOptions = {
      hand,
      ranksFile,
      chopIsWin
    }

    for (let j = 1; j <= 52; j++) {
      if (turnCards.has(j) || hand.includes(j)) {
        continue
      }

      if (hand.length >= 4) {
        result.push(omahaAheadScore({ ...evalOptions, board: [...board, j] }))
      } else {
        result.push(aheadPct({ ...evalOptions, board: [...board, j] }, vsRange))
      }
    }
  } else {
    result.push(
      hand.length >= 4
        ? omahaAheadScore({ hand, ranksFile, chopIsWin, board })
        : aheadPct({ hand, ranksFile, chopIsWin, board }, vsRange)
    )
  }

  return result.map((eq) => Math.round(eq * 100) / 100)
}

const defaultEval = (board: number[], hand: number[], ranksPath: string) =>
  evaluate([...board, ...hand], ranksPath)

// doesn't account for runouts, just what % of hands you're ahead of currently
export const aheadPct = (
  { board, hand, ranksFile, chopIsWin }: EvalOptions,
  vsRange: number[][],
  evalFunc = defaultEval
) => {
  const blocked = new Set([...hand, ...board])

  const vsRangeRankings = vsRange
    .filter((combo) => !blocked.has(combo[0]) && !blocked.has(combo[1]))
    .map((combo) => {
      return evalFunc(board, combo, ranksFile).value
    })

  const handRanking = evalFunc(board, hand, ranksFile).value

  let beats = 0

  for (const value of vsRangeRankings) {
    if (handRanking > value) {
      beats += 1
    } else if (handRanking === value) {
      beats += chopIsWin ? 1 : 0.5
    }
  }

  return (beats / vsRangeRankings.length) * 100
}

export const equityBuckets = [
  0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
  92.5, 95, 97.5, 100
]

// much faster implementation than checking combo by combo
export const combosVsRangeEquity = (
  board: number[],
  range: number[][],
  vsRange: number[][],
  ranksFile: string,
  chopIsWin?: boolean
) => {
  const getRangeRankings = (r: number[][]) => {
    return r
      .filter(([c1, c2]) => !board.includes(c1) && !board.includes(c2))
      .map((combo) => {
        const evaled =
          combo.length >= 4
            ? evalOmaha(board, combo, ranksFile)
            : evaluate([...combo, ...board], ranksFile)

        return [combo, evaled.value] as [number[], number]
      })
  }

  const vsRangeRankings = getRangeRankings(vsRange)
  const rangeRankings = getRangeRankings(range)

  const hash: [[number, number], number][] = []

  for (let i = 0; i < rangeRankings.length; i++) {
    const [hand, handRanking] = rangeRankings[i]

    let beats = 0
    let matchups = 0

    for (let j = 0; j < vsRangeRankings.length; j++) {
      const [villainHand, value] = vsRangeRankings[j]
      // impossible matchup
      if (hand.includes(villainHand[0]) || hand.includes(villainHand[1])) {
        continue
      }

      if (handRanking > value) {
        beats += 1
      } else if (handRanking === value) {
        beats += chopIsWin ? 1 : 0.5
      }

      matchups++
    }

    const idxOfLarger = hand.indexOf(Math.max(...hand))

    const x = hand[idxOfLarger],
      y = hand[idxOfLarger === 0 ? 1 : 0]

    hash.push([[y, x], Math.round((beats / matchups) * 10000) / 100])
  }

  return hash
}

// takes ~0.4ms in sequential runs
export const omahaAheadScore = (
  evalOptions: EvalOptions,
  vsRange?: number[][]
) => {
  return aheadPct(
    evalOptions,
    vsRange || (evalOptions.hand.length > 4 ? plo5Range : ploRange),
    evalOmaha
  )
}
