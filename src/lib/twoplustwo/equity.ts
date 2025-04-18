import { iso } from '@lib/iso'
import { EquityHash, RiverEquityHash, equityFromHash } from '../hashing/hash'
import { initFromPathSync } from '../init'
import { plo5Range, ploRange } from '../ranges'
import { evalOmaha, evaluate, fastEval, genBoardEval } from './strength'

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

/**
 * sorts both ranges by strength
 * todo add `useBlockers` and measure perf diff
 * todo create wrapper function rangeVsRangeAhead that just averages
 */
export const combosVsRangeAhead = (
  board: number[],
  range: number[][],
  vsRange: number[][],
  ranksFile?: string,
  chopIsWin?: boolean
) => {
  initFromPathSync(ranksFile)

  const isOmaha = range[0].length >= 4

  const evalHand = isOmaha ? null : genBoardEval(board, fastEval)

  const getRangeRankings = (r: number[][]) => {
    // the board blocks part of both ranges
    const valid = r.filter(
      ([c1, c2]) => !board.includes(c1) && !board.includes(c2)
    )

    return isOmaha
      ? valid.map(
          (combo) =>
            [combo, evalOmaha(board, combo).value] as [number[], number]
        )
      : valid.map((combo) => [combo, evalHand(combo)] as [number[], number])
  }

  // console.time('gen') // ~0.6ms
  const rangeRankings = getRangeRankings(range)
  const vsRangeRankings = getRangeRankings(vsRange)
  // console.timeEnd('gen')
  // console.time('sorts') ~ .08ms
  rangeRankings.sort((a, b) => a[1] - b[1])
  vsRangeRankings.sort((a, b) => a[1] - b[1])
  // console.timeEnd('sorts')

  let blockerHash: Record<string, Record<string, number[]>> = {} // blocked hand strengths for any combo
  for (let i = 0; i < vsRangeRankings.length; i++) {
    const [combo, val] = vsRangeRankings[i]
    for (const [c1, c2] of [
      [combo[0], combo[1]],
      [combo[1], combo[0]]
    ]) {
      blockerHash[c1] ??= {}
      blockerHash[c1][c2] ??= []
      blockerHash[c1][c2].push(val)
    }

    for (const card of combo) {
    }
  }

  // console.time('results') ~10ms with blockers .03ms without
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
      // impossible matchup
      /*if (hand.includes(vsHand[0]) || hand.includes(vsHand[1])) {
        continue
      }*/
      beats += chopIsWin || handRanking > vsRanking ? 1 : 0.5
      vsPointer++
      beats
    }

    const idxOfLarger = hand.indexOf(Math.max(...hand))

    const x = hand[idxOfLarger],
      y = hand[idxOfLarger === 0 ? 1 : 0]

    result.push([
      [y, x],
      Math.round((beats / vsRangeRankings.length) * 10000) / 100
    ])
  }
  // console.timeEnd('results')
  return result
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
