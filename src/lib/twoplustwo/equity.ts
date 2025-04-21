import { iso } from '../iso.js'
import { EquityHash, RiverEquityHash, equityFromHash } from '../hashing/hash.js'
import { evalOmaha, genBoardEval } from './strength.js'
import { evaluate } from '../../evaluate.js'
import { Range } from 'lib/ranges/ranges.js'
import { sortCards } from 'lib/sort.js'

export type EvalOptions = {
  board: number[]
  hand: number[]
  flopHash?: EquityHash | RiverEquityHash
  chopIsWin?: boolean
}

// returns equity for every river, or whatever is inside the flop hash
export const equityEval = ({
  board,
  hand,
  flopHash,
  vsRange,
  chopIsWin
}: EvalOptions & { vsRange: Range }) => {
  const result: number[] = []

  if (board.length === 3) {
    if (flopHash) {
      const { board: isoBoard, hand: isoHand } = iso({ board, hand })
      return equityFromHash(flopHash, isoBoard, isoHand)
    } else {
      for (let j = 1; j <= 52; j++) {
        if (board.includes(j)) {
          continue
        }
        result.push(
          ...(equityEval({
            hand,
            vsRange,
            chopIsWin,
            board: [...board, j]
          }) as number[])
        )
      }
    }
  } else {
    const evalOptions = {
      hand,
      chopIsWin
    }

    const evalFunc = hand.length >= 4 ? omahaAheadScore : aheadPct

    if (board.length === 4) {
      const boardCards = new Set(board)

      for (let j = 1; j <= 52; j++) {
        if (boardCards.has(j) || hand.includes(j)) {
          continue
        }

        result.push(evalFunc({ ...evalOptions, board: [...board, j] }, vsRange))
      }
    } else {
      result.push(evalFunc({ ...evalOptions, board }, vsRange))
    }
  }

  return result.map((eq) => Math.round(eq * 100) / 100)
}

const defaultEval = (board: number[], hand: number[]) =>
  evaluate([...board, ...hand])

// doesn't account for runouts, just what % of hands you're ahead of currently
export const aheadPct = (
  { board, hand, chopIsWin }: EvalOptions,
  vsRange: Range,
  evalFunc = defaultEval
) => {
  const blocked = new Set([...hand, ...board])

  const vsRangeRankings = getRangeRankings(
    vsRange,
    (h) => evalFunc(board, h).value,
    blocked
  )

  const handRanking = evalFunc(board, hand).value

  let beats = 0

  for (const [_, value] of vsRangeRankings) {
    if (handRanking > value) {
      beats += 1
    } else if (handRanking === value) {
      beats += chopIsWin ? 1 : 0.5
    }
  }

  return (beats / vsRangeRankings.length) * 100
}

/** returns [hand, n, weight][] */
const getRangeRankings = (
  r: Range,
  evalHand: (h: number[]) => number,
  blocked?: Set<number>
) => {
  let result: [number[], number, number][] = []

  r.forEach((combo, weight) => {
    if (combo.some((c) => blocked.has(c))) return
    const strength = evalHand(combo)
    result.push([combo, strength, weight])
  })

  return result
}

// range vs range
export type RvRArgs = {
  board: number[]
  range: Range
  vsRange: Range
  chopIsWin?: boolean
}

/**
 * sorts both ranges by strength
 *
 * todo create wrapper function rangeVsRangeAhead that just averages
 *
 * 4k/s on full ranges
 */
export const combosVsRangeAhead = ({
  board,
  range,
  vsRange,
  chopIsWin
}: RvRArgs) => {
  const blocked = new Set(board) // todo test what 2p2 returns for duplicate cards, if it's "invalid hand" just run it and use that
  const isOmaha = range.getHandLen() >= 4

  const evalHand = isOmaha
    ? (hand: number[]) => evalOmaha(board, hand).value
    : genBoardEval(board)

  const rangeRankings = getRangeRankings(range, evalHand, blocked)
  const vsRangeRankings = getRangeRankings(vsRange, evalHand, blocked)
  rangeRankings.sort((a, b) => a[1] - b[1])
  vsRangeRankings.sort((a, b) => a[1] - b[1])

  const result: [number[], number][] = []
  let vsPointer = 0
  let beats = 0
  let weightSum = 0

  for (let i = 0; i < rangeRankings.length; i++) {
    const [hand, handRanking, weight] = rangeRankings[i]

    while (vsPointer < vsRangeRankings.length) {
      const [vsHand, vsRanking, vsWeight] = vsRangeRankings[vsPointer]
      vsPointer++
      // blockers
      if (vsHand.some((c) => hand.includes(c))) {
        continue
      }

      const winNum =
        handRanking < vsRanking
          ? 0
          : chopIsWin || handRanking > vsRanking
            ? 1
            : 0.5
      const matchupWeight = weight * vsWeight
      beats += winNum * matchupWeight
      weightSum += matchupWeight
    }

    result.push([sortCards(hand), beats / weightSum])
  }

  return result
}

// returns average ahead of range
export const rangeVsRangeAhead = (args: RvRArgs) => {
  const res = combosVsRangeAhead(args)
  return res.reduce((a, c) => a + c[1], 0) / res.length
}

export const omahaAheadScore = (evalOptions: EvalOptions, vsRange: Range) => {
  return aheadPct(evalOptions, vsRange, evalOmaha)
}
