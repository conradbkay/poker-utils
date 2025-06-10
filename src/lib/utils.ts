/**
 *
 * @param depth how many cards to generate
 * combos and combos arr returned sorted descending
 */
export const genCardCombinations = (depth = 3, minCard = 0) => {
  if (depth > 5) {
    // for depth=6 output length would be 14658134400
    throw new Error('calculating too many combinations')
  }

  const maxCard = minCard + 51
  let result: number[][] = [[]]

  for (let i = 1; i <= depth; i++) {
    let cur = []

    for (const cards of result) {
      const start = cards.length ? cards[cards.length - 1] - 1 : maxCard
      for (let j = start; j >= minCard + (depth - i); j--) {
        cur.push([...cards, j])
      }
    }

    result = cur
  }

  return result
}

// binary search will be slower than this for small arrays
export const closestIdx = (counts: number[], value: number) => {
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
