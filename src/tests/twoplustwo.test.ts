import test from 'node:test'
import assert from 'node:assert/strict'

import { boardToInts } from '../lib/cards/utils'
import { omahaAheadScore } from '../lib/twoplustwo/equity'
import { evalOmaha } from 'src/lib/evaluate'
import { PokerRange } from '../lib/range/range'

test('PLO Strength', () => {
  const board = boardToInts('KhTc5cJc3s')
  const hand = boardToInts('Ad5s5h2s')

  console.log(evalOmaha(board, hand))
  assert.ok(evalOmaha(board, hand).handName === 'Three of a Kind')

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

  assert.ok(win < 0.5)
})
