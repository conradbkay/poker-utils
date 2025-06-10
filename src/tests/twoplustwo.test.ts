import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { hash } from '../lib/cards/permuHash.js'
import { resolve } from 'path'
import { boardToInts, randUniqueCards } from '../lib/cards/utils.js'
import { omahaAheadScore } from '../lib/twoplustwo/equity.js'
import { evalOmaha } from '../lib/twoplustwo/strength.js'
import { initFromPathSync } from '../lib/init.js'
import { PokerRange } from '../lib/range/range.js'

initFromPathSync(resolve('./HandRanks.dat'))

test('combinations hash', (t) => {
  assert.deepEqual(hash[5][3][0], [0, 1, 2])
})

test('PLO Strength', (t) => {
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
