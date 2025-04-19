import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { ranges, resolveRanges } from '../lib/ranges/ranges'
import { boardToInts } from '../lib/cards/utils'

test('resolveRanges', (t) => {
  const huSRP = resolveRanges(-2, -1, 1, 1)

  assert.equal(huSRP.length, 2)
  assert.ok(huSRP[0])
  assert.ok(huSRP[1])
})

test('a2c is 1326 combos', (t) => {
  assert.equal(ranges['a2c'].length, 1326)
})

test('boardToInts', (t) => {
  assert.deepEqual(boardToInts(['As', '4s']), [52, 12])
})
