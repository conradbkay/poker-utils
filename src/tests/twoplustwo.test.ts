import test from 'node:test'
import assert from 'node:assert/strict'

import { hash } from '../lib/cards/permuHash'
import { boardToInts, randUniqueCards } from '../lib/cards/utils'
import { omahaAheadScore } from '../lib/twoplustwo/equity'
import { evalOmaha } from 'src/lib/evaluate'
import { PokerRange } from '../lib/range/range'

test('combinations hash', () => {
  assert.deepEqual(hash[5][3][0], [0, 1, 2])
})

test('PLO Strength', () => {
  const board = boardToInts('2s 5c 9h')
  const hand = boardToInts('6s 7s 4c Ac')

  evalOmaha(board, hand)

  const range = new PokerRange()

  for (let i = 0; i < 100; i++) {
    range.set(randUniqueCards(4))
  }

  omahaAheadScore(
    {
      board,
      hand
    },
    range
  )
})
