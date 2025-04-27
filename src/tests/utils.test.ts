import test from 'node:test'
import assert from 'node:assert/strict'
import { sortCards } from '../lib/sort.js'
import { randomInt } from 'node:crypto'
import { boardToInts, randUniqueCards } from '../lib/cards/utils.js'

test('sort cards', () => {
  for (let i = 0; i < 5000; i++) {
    const cards = randUniqueCards(randomInt(2, 12)) // 2-11
    assert.deepEqual(
      [...cards].sort((a, b) => b - a),
      sortCards(cards)
    )
  }
})

test('boardToInts', (t) => {
  assert.deepEqual(boardToInts(['As', '4s']), [52, 12])
  assert.deepEqual(boardToInts('As4s'), [52, 12])
  assert.deepEqual(boardToInts('as 4s'), [52, 12])
  assert.deepEqual(boardToInts('4s as'), [12, 52])
})
