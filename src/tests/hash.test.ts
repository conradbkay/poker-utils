import { skip } from 'node:test'
import assert from 'node:assert/strict'
import { flopEquities } from '../lib/hashing/hash'
import { HoldemRange } from '../lib/range/holdem'
import { flops } from 'src/lib/hashing/flops'
import { any2 } from 'src/lib/range/range'

// takes a bit long (500ms)
skip('flopEquities', () => {
  const vsRange = HoldemRange.fromPokerRange(any2)
  const flop = flops[0][1]
  const equities = flopEquities(flop, vsRange)
  assert.equal(equities.length, 1326)
})
