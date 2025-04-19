import { iso } from '@lib/iso'
import { EquityHash, RiverEquityHash, equityFromHash } from '../hashing/hash'
import { initFromPathSync, lazyInitFromPath } from '../init'
import { plo5Range, ploRange } from '../ranges'
import { evalOmaha, evaluate, fastEval, genBoardEval, nextP } from './strength'

type Range = number[][]

export type EvalOptions = {
  board: number[]
  hand: number[]
  flopHash?: EquityHash | RiverEquityHash
  ranksFile?: string
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

const defaultEval = (board: number[], hand: number[]) =>
  evaluate([...board, ...hand])

// doesn't account for runouts, just what % of hands you're ahead of currently
export const aheadPct = (
  { board, hand, ranksFile, chopIsWin }: EvalOptions,
  vsRange: number[][],
  evalFunc = defaultEval
) => {
  initFromPathSync(ranksFile)

  const blocked = new Set([...hand, ...board])

  const vsRangeRankings = vsRange
    .filter((combo) => !blocked.has(combo[0]) && !blocked.has(combo[1]))
    .map((combo) => {
      return evalFunc(board, combo).value
    })

  const handRanking = evalFunc(board, hand).value

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

// range vs range
export type RvRArgs = {
  board: number[]
  range: number[][]
  vsRange: number[][]
  ranksFile?: string
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
  ranksFile,
  chopIsWin
}: RvRArgs) => {
  initFromPathSync(ranksFile)

  const isOmaha = range[0].length >= 4

  const evalHand = isOmaha ? null : genBoardEval(board)

  const getRangeRankings = (r: number[][]) => {
    let result: [number[], number][] = []

    for (const combo of r) {
      if (combo.some((c) => board.includes(c))) continue
      const strength = isOmaha ? evalOmaha(board, combo).value : evalHand(combo)
      result.push([combo, strength])
    }

    return result
  }

  const rangeRankings = getRangeRankings(range)
  const vsRangeRankings = getRangeRankings(vsRange)
  rangeRankings.sort((a, b) => a[1] - b[1])
  vsRangeRankings.sort((a, b) => a[1] - b[1])

  const result: [[number, number], number][] = []
  let vsPointer = 0
  let beats = 0

  for (let i = 0; i < rangeRankings.length; i++) {
    const [hand, handRanking] = rangeRankings[i]

    while (
      vsPointer < vsRangeRankings.length &&
      handRanking >= rangeRankings[vsPointer][1]
    ) {
      const [vsHand, vsRanking] = vsRangeRankings[vsPointer]
      vsPointer++
      // blockers
      if (vsHand.some((c) => hand.includes(c))) {
        continue
      }
      beats += chopIsWin || handRanking > vsRanking ? 1 : 0.5
    }

    const idxOfLarger = hand.indexOf(Math.max(...hand))

    const x = hand[idxOfLarger],
      y = hand[idxOfLarger === 0 ? 1 : 0]

    result.push([
      [y, x],
      Math.round((beats / vsRangeRankings.length) * 10000) / 100
    ])
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
  vsRange?: number[][]
) => {
  return aheadPct(
    evalOptions,
    vsRange || (evalOptions.hand.length > 4 ? plo5Range : ploRange),
    evalOmaha
  )
}
