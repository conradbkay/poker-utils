import test from 'node:test'
import assert from 'node:assert/strict'

import { boardToInts } from '../lib/cards/utils'
import { omahaAheadScore } from '../lib/twoplustwo/equity'
import { PokerRange } from '../lib/range/range'

test('PLO Strength', () => {
  const board = boardToInts('AhKc5cTc3s')
  const hand = boardToInts('QcQdJs2s')

  const range = new PokerRange()

  range.set(boardToInts('2c4s8cJc'), 1)
  range.set(boardToInts('AcAdJdJc'), 1)
  range.set(boardToInts('QhQsJh2c'), 1)

  const [win, tie] = omahaAheadScore(
    {
      board,
      hand
    },
    range
  )

  assert.ok(win < 0.34)
  assert.ok(tie > 0.32 && tie < 0.34)
})
