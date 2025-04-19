import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { hash } from '../lib/cards/permuHash'
import { resolve } from 'path'
import { boardToInts } from '../lib/cards/utils'
import { omahaAheadScore } from '../lib/twoplustwo/equity'
import { evalOmaha } from '../lib/twoplustwo/strength'
import { initFromPathSync } from '../lib/init'
import { randCards } from '../benchmarks/utils'

initFromPathSync(resolve('./HandRanks.dat'))

test('combinations hash', (t) => {
  assert.deepEqual(hash[5][3][0], [0, 1, 2])
})

test('PLO Strength', (t) => {
  const board = boardToInts('2s 5c 9h')
  const hand = boardToInts('6s 7s 4c Ac')

  evalOmaha(board, hand)

  omahaAheadScore(
    {
      board,
      hand
    },
    new Array(100).fill(0).map(() => randCards(4, false))
  )
})
