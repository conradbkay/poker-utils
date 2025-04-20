import test from 'node:test'
import assert from 'node:assert/strict'
import { genCardCombinations, getHandIdx } from '../lib/utils.js'

const allFlops = genCardCombinations(3)
const allHands = genCardCombinations(2)

test('getHandIdx', (t) => {
  let found = new Set<number>()

  for (let a = 52; a > 1; a--) {
    for (let b = a - 1; b >= 1; b--) {
      found.add(getHandIdx(Math.random() > 0.5 ? [a, b] : [b, a]))
    }
  }

  assert.equal(found.size, 1326)
})

test('genCardCombinations', (t) => {
  assert.equal(allFlops.length, (52 * 51 * 50) / 6)
  assert.equal(allHands.length, (52 * 51) / 2)
})
