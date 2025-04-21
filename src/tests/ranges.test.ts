import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { boardToInts } from '../lib/cards/utils.js'
import { any2 } from '../lib/ranges/ranges.js'

test('any2 is 1326 combos', (t) => {
  assert.equal(any2.getSize(), 1326)
})

test('boardToInts', (t) => {
  assert.deepEqual(boardToInts(['As', '4s']), [52, 12])
})
