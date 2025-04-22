import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { getRank, getSuit } from 'lib/cards/utils'
import { DECK, RANKS } from 'lib/constants'

describe('cards/utils', (t) => {
  test('getSuit', () => {
    assert.deepEqual(
      [0, 1, 2, 3],
      [1, 2, 3, 4].map((c) => getSuit(c))
    )
  })
  test('getRank', () => {
    for (const card in DECK) {
      assert.equal(RANKS[getRank(DECK[card])], card[0])
    }
  })
})
