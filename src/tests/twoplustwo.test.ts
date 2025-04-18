import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { hash } from '../lib/eval/permuHash'
import { resolve } from 'path'
import { boardToInts } from '../lib/eval/utils'
import { omahaAheadScore } from '../lib/twoplustwo/equity'
import { evalOmaha } from '../lib/twoplustwo/strength'
import { initFromPathSync } from '../lib/init'

initFromPathSync(resolve('./HandRanks.dat'))

test('combinations hash', (t) => {
  assert.deepEqual(hash[5][3][0], [0, 1, 2])
})

test('PLO Strength', (t) => {
  const board = boardToInts('2s 5c 9h')
  const hand = boardToInts('6s 7s 4c Ac')
  const ranksFile = resolve('./HandRanks.dat')

  evalOmaha(board, hand)

  omahaAheadScore({
    board,
    hand,
    ranksFile
  })
})
