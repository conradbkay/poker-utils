import test from 'node:test'
import assert from 'node:assert/strict'
import { sortCards } from '../lib/sort.js'
import { randomInt } from 'node:crypto.js'
import { randCards } from '../benchmarks/utils.js'

test('sort cards', () => {
  for (let i = 0; i < 5000; i++) {
    const cards = randCards(randomInt(2, 12), false) // 2-11
    assert.deepEqual(
      [...cards].sort((a, b) => b - a),
      sortCards(cards)
    )
  }
})
