import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { genCardCombinations } from '../lib/utils.js'
import { sortCards } from '../lib/sort.js'
import { HoldemRange } from '../lib/range/holdem.js'

test('combos map to/from 0-1325', () => {
  let count = {}

  for (let c1 = 51; c1 >= 0; c1--) {
    for (let c2 = 51; c2 >= 0; c2--) {
      if (c1 === c2) {
        continue
      }
      const idx = HoldemRange.getHandIdx([c1, c2])

      assert.ok(idx >= 0 && idx <= 1325, `idx out of bounds: ${idx}`)
      assert.deepEqual(HoldemRange.fromHandIdx(idx), sortCards([c1, c2]))

      count[idx] = (count[idx] || 0) + 1
    }
  }

  assert.equal(Object.keys(count).length, 1326)
  assert.equal(
    Object.values(count).every((v) => v === 2),
    true
  )
})

const allFlops = genCardCombinations(3)
const allHands = genCardCombinations(2)

test('genCardCombinations', () => {
  assert.equal(allFlops.length, (52 * 51 * 50) / 6)
  assert.equal(allHands.length, (52 * 51) / 2)
})
