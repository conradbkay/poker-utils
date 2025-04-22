import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  containsStraight,
  formatCards,
  getRank,
  getSuit,
  makeCard,
  suitCount,
  uniqueRanks
} from 'lib/cards/utils'
import { DECK, RANKS } from 'lib/constants'
import { randCards } from 'benchmarks/utils'
import { evaluate } from 'lib/evaluate'
import { HAND_TYPES } from 'lib/twoplustwo/constants'
import { initFromPathSync } from 'lib/init'

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
  test('uniqueRanks', () => {
    assert.equal(13, uniqueRanks(Object.values(DECK)).length)
  })
  test('makeCard', () => {
    assert.equal(DECK['Ah'], makeCard(14, 2))
  })
  test('suitCount', () => {
    assert.equal(3, suitCount([1, 2, 3, 5, 6, 7, 9, 10, 11]))
  })
  test('containsStraight', () => {
    for (let i = 0; i < 1000; i++) {
      const hand = randCards(7)
      const { handName, handType } = evaluate(hand)
      const containsStrt = containsStraight(hand)

      if (handName === 'Straight') {
        assert.equal(containsStrt, true)
      } else if (handType < HAND_TYPES.indexOf('Straight')) {
        assert.equal(containsStrt, false)
      }
    }
  })
})
