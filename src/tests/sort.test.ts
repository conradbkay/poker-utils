import test from 'node:test'
import assert from 'node:assert/strict'
import { sortCards } from '../lib/sort.js'
import { randUniqueCards } from '../lib/cards/utils.js'

test('sort cards', () => {
  for (let n = 1; n <= 11; n++) {
    for (let i = 0; i < 1000; i++) {
      const cards = randUniqueCards(n)
      assert.deepEqual(
        [...cards].sort((a, b) => b - a),
        sortCards(cards)
      )
    }
  }
})
