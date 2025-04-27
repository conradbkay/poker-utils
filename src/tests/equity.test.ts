import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { any2 } from '../lib/range/range.js'
import {
  fastCombosVsRangeAhead,
  rangeVsRangeAhead
} from '../lib/twoplustwo/equity.js'
import { boardToInts, randUniqueCards } from '../lib/cards/utils.js'
import { initFromPathSync } from 'src/lib/init.js'
import { BitRange, idxBlocks } from 'src/lib/range/bit.js'

const range = any2
const flop = boardToInts('Js9h4h') // if we did totally random we might get weird always chop boards
const options = {
  board: [...flop, ...randUniqueCards(2)],
  range,
  vsRange: range
}

describe('equity calculations', () => {
  test('rangeVsRangeAhead returns 0.5 for equal ranges', () => {
    const eq = rangeVsRangeAhead(options)
    assert.equal(Math.round(eq * 1000000) / 1000000, 0.5)
  })
  it('... > 0.5 when chopIsWin=true', () => {
    for (let i = 0; i < 10; i++) {
      const eq = rangeVsRangeAhead({ ...options, chopIsWin: true })
      assert.ok(eq > 0.501) // usually result of prior test is like .500000001
      assert.ok(eq < 0.6) // probably there's no more than 20% chops anywhere on a normal flop
    }
  })
})

initFromPathSync('./HandRanks.dat')

describe('fast 2 card equity', () => {
  const range = BitRange.fromPokerRange(options.range)
  const vsRange = BitRange.fromPokerRange(options.vsRange)
  const aheads = fastCombosVsRangeAhead({
    ...options,
    range,
    vsRange
  })
  const aheadsNext = fastCombosVsRangeAhead({
    ...options,
    range,
    vsRange
  })

  console.time('100')
  for (let i = 0; i < 100; i++) {
    fastCombosVsRangeAhead({
      ...options,
      range,
      vsRange
    })
  }
  console.timeEnd('100')

  assert.deepEqual(aheads, aheadsNext)
})
