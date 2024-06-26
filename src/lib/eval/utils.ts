export const getSuit = (card: number) => {
  return (card - 1) % 4
}

export const getRank = (card: number) => {
  return Math.floor((card - 1) / 4) + 2
}

export const getRankStr = (card: number) => {
  return [
    null,
    null,
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'T',
    'J',
    'Q',
    'K',
    'A'
  ][getRank(card)]
}

export const containsStraight = (board: number[]) => {
  const ranks = uniqueRanks(board).sort((a, b) => a - b)

  if (ranks.slice(0, 4).toString() === '2,3,4,5' && ranks.includes(14)) {
    return true
  }

  for (let start = 0; start <= ranks.length - 5; start++) {
    let gap = false

    for (let j = start; j < start + 4; j++) {
      if (ranks[j] + 1 !== ranks[j + 1]) {
        gap = true
      }
    }

    if (!gap) {
      return true
    }
  }

  return false
}

export const calcStraightOuts = (board: number[]): number => {
  let result = 0

  for (let i = 1; i <= 52; i += 4) {
    const hypothetical = [...board, i]

    if (containsStraight(hypothetical)) {
      result++
    }
  }

  return result
}

export const straightPossible = (board: number[]): boolean => {
  const helper = (ranks: number[]) => {
    if (ranks.length < 3) {
      return false
    }

    for (let i = 0; i < ranks.length - 2; i++) {
      if (ranks[i + 2] - ranks[i] <= 4) {
        return true
      }
    }

    return false
  }

  const ranks = uniqueRanks(board).sort((a, b) => a - b)

  if (helper(ranks)) {
    return true
  }

  return false
}

export const highCard = (board: number[]): number => {
  return Math.max(...board.map((card) => getRank(card)))
}

export const suitCount = (board: number[]): number => {
  return new Set(board.map((card) => getSuit(card))).size
}

export const suitCounts = (board: number[]): number[] => {
  return board.reduce(
    (accum, cur) => {
      accum[getSuit(cur)]++
      return accum
    },
    [0, 0, 0, 0]
  )
}

export const mostSuit = (board: number[]): number =>
  Math.max(...suitCounts(board))

export const uniqueRanks = (board: number[]): number[] => {
  return Array.from(new Set(board.map((c) => getRank(c))))
}
