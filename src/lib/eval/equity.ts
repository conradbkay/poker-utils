import { EquityHash, combosMap, equityFromHash } from '../hashing/hash'

import {
  convertCardsToNumbers,
  deckWithoutSpecifiedCards,
  evaluate,
  shuffleDeck
} from './strength'

type Combo = [number, number]

type Range = Combo[]

export type EvalOptions = {
  board: number[]
  hand: number[]
  ranges: Range[]
  customStreet?: number
  fastTurns?: boolean
  flopHash: EquityHash
}

// returns [[vsOopRangeFlop, vsIpRangeFlop],...]
export const equityEval = ({
  board,
  hand,
  customStreet,
  fastTurns,
  ranges,
  flopHash
}: EvalOptions): number[] => {
  if (customStreet === undefined) {
    customStreet = -1
  }

  const both = ranges.map((vsRange) => {
    const result: number[] = []

    const addStreet = (i: number) => {
      if (i === 3) {
        result.push(equityFromHash(flopHash, board.slice(0, 3), hand))
      } else if (i === 4) {
        let sum = 0
        let incs = 0

        if (fastTurns) {
          const deck = deckWithoutSpecifiedCards([...hand, ...board])
          shuffleDeck(deck)

          for (let j = 1; j < 13; j++) {
            sum += equityCalc([...board.slice(0, 4), j], hand, vsRange)
            incs++
          }
        } else {
          for (let j = 1; j <= 52; j++) {
            if (board.slice(0, 4).includes(j) || hand.includes(j)) {
              continue
            }
            sum += equityCalc([...board.slice(0, 4), j], hand, vsRange)
            incs++
          }
        }

        result.push(Math.round((sum / incs) * 100) / 100)
      } else {
        result.push(Math.round(equityCalc(board, hand, vsRange) * 100) / 100)
      }
    }

    if (customStreet !== -1) {
      addStreet(customStreet + 3)
    } else {
      for (let i = 3; i <= board.length; i++) {
        addStreet(i)
      }
    }
    return result
  })

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
  vsRange: number[][]
) => {
  const blocked = [...hand, ...board]

  const afterBlockers = vsRange.filter((combo) => {
    return !blocked.includes(combo[0]) && !blocked.includes(combo[1])
  })

  const vsRangeRankings = afterBlockers.map((combo) => {
    return evaluate([...combo, ...board]).value
  })

  const handRanking = evaluate(blocked).value

  let beats = 0

  for (const value of vsRangeRankings) {
    if (handRanking > value) {
      beats += 1
    } else if (handRanking === value) {
      beats += 0.5
    }
  }

  return (beats / vsRangeRankings.length) * 100
}

export const rangeEquityCalc = (
  board: number[],
  range: number[][],
  vsRange: number[][]
) => {
  const getRangeRankings = (r: number[][]) => {
    return r
      .filter(([c1, c2]) => !board.includes(c1) && !board.includes(c2))
      .map((combo) => {
        return [combo, evaluate([...combo, ...board]).value] as [
          number[],
          number
        ]
      })
  }

  const vsRangeRankings = getRangeRankings(vsRange)
  const rangeRankings = getRangeRankings(range)

  const hash: [number, number][] = []

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
        beats += 0.5
      }

      matchups++
    }

    const idxOfLarger = hand.indexOf(Math.max(...hand))

    const x = hand[idxOfLarger === 0 ? 1 : 0],
      y = hand[idxOfLarger]
    // [2,1] turns into 52+0
    hash.push([
      combosMap[y + ' ' + x],
      Math.round((beats / matchups) * 10000) / 100
    ])
  }

  return hash
}

export const flopEquities = (
  flop: string,
  range: number[][],
  vsRange: number[][]
) => {
  const boardCards: string[] = []

  for (let i = 0; i < flop.length; i += 2) {
    boardCards.push(flop.slice(i, i + 2))
  }

  const boardInts = convertCardsToNumbers(boardCards)

  const deck = deckWithoutSpecifiedCards(boardInts)

  const hash = new Array(1326).fill(-1)

  // 2162 runouts per flop, maybe we could do like 400 without much loss
  for (let k = 0; k < deck.length - 1; k++) {
    for (let m = k + 1; m < deck.length; m++) {
      const fullBoard = [deck[k], deck[m], ...boardInts]

      const equities = rangeEquityCalc(fullBoard, range, vsRange)

      for (const [hand, equity] of equities) {
        if (hash[hand] === -1) {
          hash[hand] = [0, 0]
        }

        hash[hand][0] += equity
        hash[hand][1]++
      }
    }
  }

  return hash.map((h) => Math.round((h[0] / h[1]) * 100) / 100)
}
