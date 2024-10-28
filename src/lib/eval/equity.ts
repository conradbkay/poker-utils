import {
  EquityHash,
  RiverEquityHash,
  boardToUnique,
  equityFromHash,
  genAllCombos,
  handIdxMap,
  handToUnique
} from '../hashing/hash'
import { ploRange } from '../ranges'
import { DECK } from './constants'
import { evalOmaha, evaluate } from './strength'
import { boardToInts, deckWithoutSpecifiedCards } from './utils'

type Combo = [number, number]

type Range = Combo[]

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
    const turnCards = new Set(board.slice(0, 4))

    for (let j = 1; j <= 52; j++) {
      if (turnCards.has(j) || hand.includes(j)) {
        continue
      }
      result.push(
        equityCalc(
          {
            board: [...board.slice(0, 4), j],
            hand,
            ranksFile,
            chopIsWin
          },
          vsRange
        )
      )
    }
  } else {
    result.push(equityCalc({ board, hand, ranksFile, chopIsWin }, vsRange))
  }

  return result.map((eq) => Math.round(eq * 100) / 100)
}

const defaultEval = (board: number[], hand: number[], ranksPath: string) =>
  evaluate([...board, ...hand], ranksPath)

// doesn't account for runouts, just what % of hands you're ahead of currently
export const equityCalc = (
  { board, hand, ranksFile, chopIsWin }: EvalOptions,
  vsRange: number[][],
  evalFunc = defaultEval
) => {
  const blocked = new Set([...hand, ...board])

  const afterBlockers = vsRange.filter((combo) => {
    return !blocked.has(combo[0]) && !blocked.has(combo[1])
  })

  const vsRangeRankings = afterBlockers.map((combo) => {
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

export const closestToIdx = (counts: number[], value: number) => {
  let result = Infinity
  let resultIdx = 0

  for (let i = 0; i < counts.length; i++) {
    const diff = Math.abs(counts[i] - value)

    if (diff < result) {
      result = diff
      resultIdx = i
    }
  }

  return resultIdx
}

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
        return [combo, evaluate([...combo, ...board], ranksFile).value] as [
          number[],
          number
        ]
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
      // impossible matchup, shouldn't count
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

export const flopEquities = (
  flop: string,
  vsRange: Range,
  ranksFile: string,
  chopIsWin: boolean = true
) => {
  const boardInts = boardToInts(flop)

  const deck = deckWithoutSpecifiedCards(boardInts)

  // if high card is 2, then there's only 1 possible low card (1)
  const hash: number[][][] = new Array(51)
    .fill(0)
    .map((_, i) => new Array(i + 1).fill(0).map((_) => new Array(23).fill(0))) // around 30k ints total

  const range = genAllCombos()

  const eqIdxCache: Record<number, number> = {}

  for (let k = 0; k < deck.length - 1; k++) {
    // 3s 2s runout is same as 2s 3s
    for (let m = k + 1; m < deck.length; m++) {
      const comboEqs = combosVsRangeEquity(
        [...boardInts, k, m],
        range,
        vsRange,
        ranksFile,
        chopIsWin
      )

      for (const [combo, eq] of comboEqs) {
        const rnd = Math.round(eq * 10) / 10

        if (!(rnd in eqIdxCache)) {
          eqIdxCache[rnd] = closestToIdx(equityBuckets, rnd)
        }

        const [i, j] = handIdxMap(combo)

        hash[i][j][eqIdxCache[rnd]]++
      }
    }
  }

  return hash
}

// takes ~0.4ms in sequential runs
export const omahaAheadScore = (
  evalOptions: EvalOptions,
  vsRange = ploRange
) => {
  return equityCalc(evalOptions, vsRange, evalOmaha)
}
