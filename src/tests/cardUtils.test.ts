import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  containsStraight,
  getRank,
  getSuit,
  makeCard,
  randUniqueCards,
  suitCount,
  uniqueRanks,
  boardToInts
} from '../lib/cards/utils.js'
import { CARDS, DECK, RANKS } from '../lib/constants.js'
import { evaluate } from '../lib/evaluate.js'
import { HAND_TYPES } from '../lib/twoplustwo/constants.js'
import { randomInt } from 'node:crypto'

describe('cards/utils', (t) => {
  test('getSuit', () => {
    assert.deepEqual(
      [0, 1, 2, 3],
      [0, 1, 2, 3].map((c) => getSuit(c))
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
    assert.equal(DECK['Ah'], makeCard(12, 2))
  })
  test('suitCount', () => {
    assert.equal(3, suitCount([0, 1, 2, 4, 5, 6, 8, 9, 10]))
  })
  test('containsStraight', () => {
    for (let i = 0; i < 1000; i++) {
      const hand = randUniqueCards(7)
      const { handName, handType } = evaluate(hand)
      const containsStrt = containsStraight(hand)

      if (handName === 'Straight') {
        assert.equal(containsStrt, true)
      } else if (handType < HAND_TYPES.indexOf('Straight')) {
        assert.equal(containsStrt, false)
      }
    }
  })
  test('randUniqueCards', () => {
    for (let i = 0; i < 5000; i++) {
      const cards = randUniqueCards(randomInt(1, 15))
      assert.equal(new Set(cards).size, cards.length)
      assert.ok(Math.max(...cards) <= Math.max(...CARDS))
      assert.ok(Math.min(...cards) >= Math.min(...CARDS))
    }
  })
  test('boardToInts', (t) => {
    assert.deepEqual(boardToInts(['As', '4s']), [51, 11])
    assert.deepEqual(boardToInts('As4s'), [51, 11])
    assert.deepEqual(boardToInts('as 4s'), [51, 11])
    assert.deepEqual(boardToInts('4s as'), [11, 51])
  })
})
