import test from 'node:test'
import assert from 'node:assert/strict'
import { flopEquities } from '../lib/hashing/hash.js'
import { HoldemRange } from '../lib/range/holdem.js'
import { flops } from 'src/lib/hashing/flops.js'
import { any2 } from 'src/lib/range/range.js'

test('flopEquities', () => {
  const vsRange = HoldemRange.fromPokerRange(any2)
  const flop = flops[40][1]
  console.time('eq')
  const equities = flopEquities(flop, vsRange)
  console.timeEnd('eq')
  assert.equal(equities.length, 1326)
})
