import { iso } from '../iso'
import { EquityHash, RiverEquityHash, equityFromHash } from '../hashing/hash'
import { evalOmaha } from './strength'
import { sortCards } from '../sort'
import { PokerRange } from '../range/range'
import { genBoardEval } from '../evaluate'

export type EvalOptions = {
  board: number[]
  hand: number[]
  flopHash?:
    | EquityHash
    | RiverEquityHash
    | (<T>(isoBoard: number[], isoHand: number[]) => T)
  chopIsWin?: boolean
}

// returns equity for every river, or whatever the flop hash returns/contains
export const equityEval = ({
  board,
  hand,
  flopHash,
  vsRange,
  chopIsWin
}: EvalOptions & { vsRange: PokerRange }) => {
  const result: number[] = []

  if (board.length === 3) {
    if (flopHash) {
      const { board: isoBoard, hand: isoHand } = iso({ board, hand })
      if (typeof flopHash === 'function') {
        return flopHash(isoBoard, isoHand)
      } else {
        return equityFromHash(flopHash, isoBoard, isoHand)
      }
    } else {
      for (let j = 0; j < 52; j++) {
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
      for (let j = 0; j < 52; j++) {
        if (board.includes(j) || hand.includes(j)) {
          continue
        }

        result.push(evalFunc({ ...evalOptions, board: [...board, j] }, vsRange))
      }
    } else {
      result.push(evalFunc({ ...evalOptions, board }, vsRange))
    }
  }

  return result
}

// doesn't account for runouts, just what % of hands you're ahead of currently
export const aheadPct = (
  { board, hand, chopIsWin }: EvalOptions,
  vsRange: PokerRange,
  evalFunc?: (board: number[], hand: number[]) => number
) => {
  const blocked = new Set([...hand, ...board])

  if (!evalFunc) {
    const boardEval = genBoardEval(board)
    evalFunc = (h) => boardEval(h)
  }

  const vsRangeRankings = getRangeRankings(
    vsRange,
    (h) => evalFunc(board, h),
    blocked
  )

  const handRanking = evalFunc(board, hand)

  let beats = 0

  for (const [_, value] of vsRangeRankings) {
    if (handRanking > value) {
      beats += 1
    } else if (handRanking === value) {
      beats += chopIsWin ? 1 : 0.5
    }
  }

  return beats / vsRangeRankings.length
}

/** returns [hand, n, weight][] */
const getRangeRankings = (
  r: PokerRange,
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
  range: PokerRange
  vsRange: PokerRange
  chopIsWin?: boolean
}

/**
 * returns [combo, ahead, weight][]
 */
export const combosVsRangeAhead = ({
  board,
  range,
  vsRange,
  chopIsWin
}: RvRArgs) => {
  const getWinVal = (p: number, vsP: number) => {
    return p < vsP ? 0 : chopIsWin || p > vsP ? 1 : 0.5
  }

  const blocked = new Set(board)
  const isOmaha = range.getHandLen() >= 4

  const evalHand = isOmaha
    ? (hand: number[]) => evalOmaha(board, hand).value
    : genBoardEval(board)

  const rangeRankings = getRangeRankings(range, evalHand, blocked)
  const vsRangeRankings = getRangeRankings(vsRange, evalHand, blocked)
  // sort by strength ascending
  rangeRankings.sort((a, b) => a[1] - b[1])
  vsRangeRankings.sort((a, b) => a[1] - b[1])

  const result: [number[], number, number][] = []

  for (let i = 0; i < rangeRankings.length; i++) {
    const [hand, handRanking, weight] = rangeRankings[i]
    let beats = 0
    let ties = 0
    let total = 0
    for (let vsIdx = 0; vsIdx < vsRangeRankings.length; vsIdx++) {
      const [vsHand, vsRanking, vsWeight] = vsRangeRankings[vsIdx]
      if (vsHand.some((c) => hand.includes(c))) {
        continue // blockers
      }

      const winVal = getWinVal(handRanking, vsRanking)
      beats += winVal * vsWeight
      ties += handRanking === vsRanking ? vsWeight : 0
      total += vsWeight
    }

    result.push([sortCards(hand), beats / total, weight])
  }

  return result
}

// returns average ahead of range
export const rangeVsRangeAhead = (args: RvRArgs) => {
  const res = combosVsRangeAhead(args)
  return res.reduce((a, c) => a + c[1], 0) / res.length
}

export const omahaAheadScore = (
  evalOptions: EvalOptions,
  vsRange: PokerRange
) => {
  return aheadPct(evalOptions, vsRange, (b, h) => evalOmaha(b, h).value)
}
