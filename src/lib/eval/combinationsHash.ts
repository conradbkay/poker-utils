/*
precompute the combinatorics for card subsets for performance
*/

import { combinations } from './combinations'

export type CombinationsHash = {
  [arrayLen: number]: {
    [subsetLen: number]: number[][] // indexes
  }
}

const hash: CombinationsHash = {}

const indexes = [0, 1, 2, 3, 4, 5]

for (let i = 3; i <= 6; i++) {
  const useArr = indexes.slice(0, i)

  hash[i] = {}

  for (let j = 2; j <= 3; j++) {
    hash[i][j] = []
    for (const combination of combinations(useArr, j)) {
      hash[i][j].push(combination)
    }
  }
}

export default hash
