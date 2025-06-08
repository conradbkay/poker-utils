import { iso } from '../iso.js'
import { EquityHash, RiverEquityHash, equityFromHash } from '../hashing/hash.js'
import { evalOmaha } from './strength.js'
import { genBoardEval } from '../evaluate.js'
import { evaluate } from '../evaluate.js'
import { PokerRange } from '../range/range.js'
import { sortCards } from '../sort.js'
import { BitRange, cardsBlockBitmap } from '../range/bit.js'
import { fromHandIdx } from '../utils.js'
import { BitSet } from 'bitset'

/**
 * maybe we calculate strength of all 1326 2 card combos, but such that each combo maps to 0-1326
 *
 * for flop/turn store each `p` in 1326 length uint32
 *
 * should have option to disable hand vs hand blockers since that takes so much time
 *
 * Only works for 2 card ranges. Optimized for twoplustwo algorithm
 */
export const fastCombosVsRangeAhead = ({
  board,
  range,
  vsRange,
  chopIsWin,
  useHandBlockers = true
}: {
  board: number[]
  range: BitRange
  vsRange: BitRange
  chopIsWin?: boolean
  useHandBlockers?: boolean // around 200x slower
}) => {
  const blockers = cardsBlockBitmap(board)
  const ranges = [range, vsRange]
  const bitmaps = ranges.map((r) => r.blockedBitmap(blockers))

  const evaluate = genBoardEval(board)
  const strengths = new Uint16Array(1326)
  for (let i = 0; i < 1326; i++) {
    strengths[i] = evaluate([10, 20])
  }

  const [{ infos }, { infos: vsInfos, weightSum: unblockedWeightSum }] =
    bitmaps.map((b, i) => genSortedBitEvalInfo(b, ranges[i].weights, strengths))

  let pointer = 0
  let beatPointer = 0
  let result: number[] = new Array(infos.length)

  let chopWeight = 0
  // like 95% of time is spent in this loop
  while (pointer < infos.length) {
    const info = infos[pointer]
    const handBlockers = useHandBlockers
      ? cardsBlockBitmap(fromHandIdx(info[0]), true)
      : null
    let weightSum = unblockedWeightSum

    while (beatPointer < vsInfos.length && info[1] >= vsInfos[beatPointer][1]) {
      if (handBlockers && handBlockers.get(vsInfos[beatPointer][0])) {
        // blocked combo
      } else if (info[1] > vsInfos[beatPointer][1]) {
        chopWeight = 0
      } else {
        chopWeight += ranges[1].weights[vsInfos[beatPointer][0]]
      }
      beatPointer++
    }
    beatPointer-- // set it to the last index we beat
    if (beatPointer < 0) {
      result[pointer] = 0
    } else {
      let beatWeight = vsInfos[beatPointer][2]

      if (handBlockers) {
        for (const blockedIdx of handBlockers) {
          if (bitmaps[1].get(blockedIdx)) {
            weightSum -= ranges[1].weights[blockedIdx]
            if (strengths[blockedIdx] < info[1]) {
              beatWeight -= ranges[1].weights[blockedIdx]
            }
          }
        }
      }

      if (!chopIsWin) {
        beatWeight -= chopWeight / 2
      }

      result[pointer] = beatWeight / unblockedWeightSum
    }

    pointer++
  }

  return result
}

export type EvalOptions = {
  board: number[]
  hand: number[]
  flopHash?: EquityHash | RiverEquityHash
  chopIsWin?: boolean
}

// ! really ugly implementation
// returns equity for every river, or whatever is inside the flop hash
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
  evaluate([...board, ...hand]).value

// doesn't account for runouts, just what % of hands you're ahead of currently
export const aheadPct = (
  { board, hand, chopIsWin }: EvalOptions,
  vsRange: PokerRange,
  evalFunc = defaultEval
) => {
  const blocked = new Set([...hand, ...board])

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
 * returns [combo, ahead, weight]
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
    let total = 0
    for (let vsIdx = 0; vsIdx < vsRangeRankings.length; vsIdx++) {
      const [vsHand, vsRanking, vsWeight] = vsRangeRankings[vsIdx]
      if (vsHand.some((c) => hand.includes(c))) {
        continue // blockers
      }

      const winVal = getWinVal(handRanking, vsRanking)
      beats += winVal * vsWeight
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
