/**
 *
 * @param depth how many cards to generate
 */
export const genCardCombinations = (depth = 3, minCard = 1) => {
  if (depth > 5) {
    // for depth=6 output length would be 14658134400
    throw new Error('calculating too many combinations')
  }

  const maxCard = minCard + 51
  let result: number[][] = [[]]

  for (let i = 1; i <= depth; i++) {
    let cur = []

    for (const cards of result) {
      const start = cards.length ? cards[0] + 1 : minCard
      for (let j = start; j <= maxCard - (depth - i); j++) {
        cur.push([j, ...cards])
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

// maps a 2 card 1-indexed hand to 0-1325. For more cards just stringify
export const getHandIdx = (hand: number[]) => {
  // a is larger than b
  const a = hand[0] > hand[1] ? hand[0] - 1 : hand[1] - 1
  const b = hand[0] > hand[1] ? hand[1] - 1 : hand[0] - 1

  const aOffset = (a * (a - 1)) / 2 // prod of even and odd is always even
  return aOffset + b
}

const idx2hand = new Array<number[]>(1326)
// 0.2ms
for (let a = 52; a > 0; a--) {
  for (let b = a - 1; b >= 0; b--) {
    idx2hand[getHandIdx([a, b])] = [a, b]
  }
}
export const fromHandIdx = (idx: number) => idx2hand[idx]
