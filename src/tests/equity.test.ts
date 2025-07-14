import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { any2 } from '../lib/range/range'
import { rangeVsRangeAhead } from '../lib/twoplustwo/equity'
import { boardToInts, randUniqueCards } from '../lib/cards/utils'
import { initFromPathSync } from 'src/lib/init'
import { HoldemRange } from '../lib/range/holdem'

const range = any2

describe('equity calculations', () => {
  test('rangeVsRangeAhead returns 0.5 for equal ranges', () => {
    const eq = rangeVsRangeAhead({
      board: randUniqueCards(3),
      range,
      vsRange: range
    })
    assert.equal(Math.round(eq * 100000) / 100000, 0.5)
  })
  it('returns > 0.5 when chopIsWin=true', () => {
    const board = boardToInts('Js9h4h') // if we did totally random we might get weird always chop boards
    const eq = rangeVsRangeAhead({
      board,
      range,
      vsRange: range,
      chopIsWin: true
    })
    assert.ok(eq > 0.501) // usually result of prior test is like .500000001
    assert.ok(eq < 0.55)
  })
})

initFromPathSync('./HandRanks.dat')

test('fastCombosVsRangeAhead', () => {
  for (let i = 0; i < 10; i++) {
    const board = randUniqueCards(5)

    // much easier to evaluate results when weights aren't different
    const equalWeightAny2 = any2
    any2.forEach((hand) => {
      equalWeightAny2.set(hand, 1)
    })

    const options = {
      board,
      range: HoldemRange.fromPokerRange(equalWeightAny2),
      vsRange: HoldemRange.fromPokerRange(equalWeightAny2)
    }

    const result = options.range.equityVsRange({
      board: options.board,
      vsRange: options.vsRange
    })

    const [win, tie, lose] = result.reduce(
      (acc, [, win, tie, lose]) => [acc[0] + win, acc[1] + tie, acc[2] + lose],
      [0, 0, 0]
    )
    const total = win + tie + lose
    assert.equal(win, lose)
    assert.deepEqual(
      result,
      options.range.equityVsRange({
        board: options.board,
        vsRange: options.vsRange
      })
    )
    const validCombos = 1081 // 47 choose 2
    const validVsPer = 990 // 45 choose 2
    assert.equal(total, validCombos * validVsPer)
  }

  it('returns 0/0/0 comparing same combo with itself', () => {})
})
