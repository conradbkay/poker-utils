import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { any2 } from '../lib/ranges/ranges.js'
import { rangeVsRangeAhead } from '../lib/twoplustwo/equity.js'
import { boardToInts, randUniqueCards } from '../lib/cards/utils.js'

describe('equity calculations', () => {
  const range = any2
  const flop = boardToInts('Js9h4h') // if we did totally random we might get weird always chop boards
  const options = {
    board: [...flop, ...randUniqueCards(2)],
    range,
    vsRange: range
  }

  test('rangeVsRangeAhead returns 0.5 for equal ranges', () => {
    const eq = rangeVsRangeAhead(options)
    assert.equal(Math.round(eq * 1000000) / 1000000, 0.5)
  })
  it('... > 0.5 when chopIsWin=true', () => {
    const eq = rangeVsRangeAhead({ ...options, chopIsWin: true })
    assert.ok(eq > 0.501) // usually result of prior test is like .500000001
    assert.ok(eq < 0.6) // probably there's no more than 20% chops anywhere on a normal flop
  })
})
