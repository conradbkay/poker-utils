import test from 'ava'

import hash from './combinationsHash'
import { evalOmaha } from './strength'
import { resolve } from 'path'
import { boardToInts } from './eval'
import { omahaAheadScore } from './equity'

test('combinations hash', (t) => {
  t.deepEqual(hash[5][3][0], [0, 1, 2])
})

test('PLO Strength', (t) => {
  const board = boardToInts('2s 5c 9h')
  const hand = boardToInts('6s 7s 4c Ac')
  const ranksFile = resolve('./HandRanks.dat')

  evalOmaha(board, hand, ranksFile)

  omahaAheadScore({
    board,
    hand,
    ranksFile
  })

  t.assert(true)
})
