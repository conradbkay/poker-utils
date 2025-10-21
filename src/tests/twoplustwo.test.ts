import test from 'node:test'
import assert from 'node:assert/strict'

import { hash } from '../lib/cards/permuHash'
import { boardToInts } from '../lib/cards/utils'
import { omahaAheadScore } from '../lib/twoplustwo/equity'
import { evalOmaha } from 'src/lib/evaluate'
import { PokerRange } from '../lib/range/range'

test('combinations hash', () => {
  assert.deepEqual(hash[5][3][0], [0, 1, 2])
})

test('PLO Strength', () => {
  const board = boardToInts('2s 5c 9h 3d 3c')
  const hand = boardToInts('As 9c Kc Kd')

  evalOmaha(board, hand)

  const range = new PokerRange()

  range.set(boardToInts('2c4s8cJc'), 1)
  range.set(boardToInts('AcAdJdJc'), 1)

  const [win] = omahaAheadScore(
    {
      board,
      hand
    },
    range
  )

  assert.ok(win === 0.5)
})
