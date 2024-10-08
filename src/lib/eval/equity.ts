import {
  EquityHash,
  RiverEquityHash,
  boardToUnique,
  equityFromHash,
  genAllCombos,
  handToUnique
} from '../hashing/hash'

import {
  convertCardsToNumbers,
  DECK,
  deckWithoutSpecifiedCards,
  evaluate
} from './strength'

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
          [...board.slice(0, 4), j],
          hand,
          vsRange,
          ranksFile,
          chopIsWin
        )
      )
    }
  } else {
    result.push(equityCalc(board, hand, vsRange, ranksFile, chopIsWin))
  }

  return result.map((eq) => Math.round(eq * 100) / 100)
}

// returns [vsOopRangeFlop, vsIpRangeFlop,vsOopRangeTurn, ...]
export const rangesEquityEval = (
  args: EvalOptions & { ranges: Range[] }
): number[] => {
  const both = args.ranges.map((vsRange) => {
    return equityEval({ ...args, vsRange })
  }) as number[][]

  const result: number[] = []

  for (let i = 0; i < both[0].length; i++) {
    result.push(both[0][i], both[1][i])
  }

  return result
}

// doesn't account for runouts, just what % of hands you're ahead of currently
export const equityCalc = (
  board: number[],
  hand: number[],
  vsRange: number[][],
  ranksFile: string,
  chopIsWin?: boolean
) => {
  const evalCards = [...hand, ...board]
  const blocked = new Set(evalCards)

  const afterBlockers = vsRange.filter((combo) => {
    return !blocked.has(combo[0]) && !blocked.has(combo[1])
  })

  const vsRangeRankings = afterBlockers.map((combo) => {
    return evaluate([...combo, ...board], ranksFile).value
  })

  const handRanking = evaluate(evalCards, ranksFile).value

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

export const flopEquities = (
  flop: string,
  vsRange: Range,
  ranksFile: string
) => {
  const boardCards: string[] = []

  for (let i = 0; i < flop.length; i += 2) {
    boardCards.push(flop.slice(i, i + 2))
  }

  const boardInts = convertCardsToNumbers(boardCards)

  const deck = deckWithoutSpecifiedCards(boardInts)

  const hash: number[][][] = new Array(51).fill(0).map((_) => new Array(51))

  for (const [j, i] of genAllCombos()) {
    let result = new Array(23).fill(0)
    // 2162 runouts per flop, maybe we could do like 400 without much loss
    for (let k = 0; k < deck.length - 1; k++) {
      for (let m = k + 1; m < deck.length; m++) {
        const fullBoard = [...boardInts, deck[k], deck[m]]
        const used = new Set(fullBoard)

        if (used.has(j) || used.has(i)) {
          continue
        }

        const eq = equityCalc(fullBoard, [j, i], vsRange, ranksFile, true)

        const eqSlot = closestToIdx(equityBuckets, eq)

        result[eqSlot]++
      }
    }

    hash[j - 2][i - 1] = result
  }

  return hash
}
