import { evalOmaha } from '../evaluate'
import { sortCards } from '../sort'
import { PokerRange } from '../range/range'
import { genBoardEval } from '../evaluate'

export type EquityResult = [win: number, tie: number, lose: number]

export type EvalOptions = {
  board: number[]
  hand: number[]
  chopIsWin?: boolean
}

// returns equity for every river, or whatever the flop hash returns/contains
export const equityEval = ({
  board,
  hand,
  vsRange,
  chopIsWin
}: EvalOptions & { vsRange: PokerRange }): EquityResult[] | EquityResult => {
  if (board.length === 3) {
    const result: EquityResult[] = []
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
        }) as EquityResult[])
      )
    }
    return result
  } else {
    const evalOptions = {
      hand,
      chopIsWin
    }

    const evalFunc = hand.length >= 4 ? omahaAheadScore : aheadPct

    if (board.length === 4) {
      const result: EquityResult[] = []
      for (let j = 0; j < 52; j++) {
        if (board.includes(j) || hand.includes(j)) {
          continue
        }

        result.push(evalFunc({ ...evalOptions, board: [...board, j] }, vsRange))
      }
      return result
    } else {
      return evalFunc({ ...evalOptions, board }, vsRange)
    }
  }
}

// doesn't account for runouts, just what % of hands you're ahead of currently
export const aheadPct = (
  { board, hand }: Omit<EvalOptions, 'chopIsWin'>,
  vsRange: PokerRange,
  evalFunc?: (board: number[], hand: number[]) => number
): EquityResult => {
  const blocked = new Set([...hand, ...board])

  if (!evalFunc) {
    const boardEval = genBoardEval(board)
    evalFunc = (_, h) => boardEval(h)
  }

  const vsRangeRankings = getRangeRankings(
    vsRange,
    (h) => evalFunc(board, h),
    blocked
  )

  const handRanking = evalFunc(board, hand)

  let wins = 0
  let losses = 0
  let ties = 0

  for (const [_, value, weight] of vsRangeRankings) {
    if (handRanking > value) {
      wins += weight
    } else if (handRanking === value) {
      ties += weight
    } else {
      losses += weight
    }
  }

  return [wins, ties, losses]
}

/** returns [hand, p, weight][] */
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

export type ComboEquity = [
  combo: number[],
  equity: EquityResult,
  weight: number
]

/**
 * returns [combo, [wins, losses, ties], weight][]
 */
export const combosVsRangeAhead = ({
  board,
  range,
  vsRange
}: RvRArgs): ComboEquity[] => {
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

  const result: ComboEquity[] = []

  for (let i = 0; i < rangeRankings.length; i++) {
    const [hand, handRanking, weight] = rangeRankings[i]
    let wins = 0
    let losses = 0
    let ties = 0
    let totalWeight = 0
    for (let vsIdx = 0; vsIdx < vsRangeRankings.length; vsIdx++) {
      const [vsHand, vsRanking, vsWeight] = vsRangeRankings[vsIdx]
      if (vsHand.some((c) => hand.includes(c))) {
        continue // blockers
      }

      if (handRanking > vsRanking) {
        wins += vsWeight
      } else if (handRanking === vsRanking) {
        ties += vsWeight
      } else {
        losses += vsWeight
      }
      totalWeight += vsWeight
    }

    if (totalWeight > 0) {
      result.push([
        sortCards(hand),
        [wins / totalWeight, ties / totalWeight, losses / totalWeight],
        weight
      ])
    }
  }

  return result
}

// returns average ahead of range
export const rangeVsRangeAhead = (args: RvRArgs): EquityResult => {
  const res = combosVsRangeAhead(args)
  const totalWins = res.reduce((a, c) => a + c[1][0] * c[2], 0)
  const totalTies = res.reduce((a, c) => a + c[1][1] * c[2], 0)
  const totalLosses = res.reduce((a, c) => a + c[1][2] * c[2], 0)
  const totalWeight = totalWins + totalTies + totalLosses

  if (totalWeight <= 0) return [0, 0, 0]

  return [
    totalWins / totalWeight,
    totalTies / totalWeight,
    totalLosses / totalWeight
  ]
}

export const omahaAheadScore = (
  evalOptions: Omit<EvalOptions, 'chopIsWin'>,
  vsRange: PokerRange
): EquityResult => {
  const [wins, ties, losses] = aheadPct(
    evalOptions,
    vsRange,
    (b, h) => evalOmaha(b, h).value
  )
  const total = wins + ties + losses

  if (total === 0) return [0, 0, 0]

  return [wins / total, ties / total, losses / total]
}
