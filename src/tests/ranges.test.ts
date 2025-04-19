import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { boardToInts } from '../lib/cards/utils'
import { any2 } from '../lib/ranges/ranges'

test('any2 is 1326 combos', (t) => {
  assert.equal(any2.length, 1326)
})

test('boardToInts', (t) => {
  assert.deepEqual(boardToInts(['As', '4s']), [52, 12])
})
