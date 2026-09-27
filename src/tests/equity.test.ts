import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import { any2 } from '../lib/range/range'
import { aheadPct, rangeVsRangeAhead } from '../lib/twoplustwo/equity'
import { boardToInts, randUniqueCards } from '../lib/cards/utils'
import { PokerRange } from '../lib/range/range'
import { HoldemRange } from '../lib/range/holdem'

const range = any2

describe('equity calculations', () => {
  test('rangeVsRangeAhead returns 0.5 for equal ranges', () => {
    const [win, tie] = rangeVsRangeAhead({
      board: randUniqueCards(3),
      range,
      vsRange: range
    })
    const eq = win + tie / 2
    assert.equal(Math.round(eq * 100000) / 100000, 0.5)
  })

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
        (acc, [, win, tie, lose]) => [
          acc[0] + win,
          acc[1] + tie,
          acc[2] + lose
        ],
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
  })

  test('rangeVsRangeAhead weights by unblocked combo pairs', () => {
    const range = new PokerRange()
    range.set(boardToInts('AhAs'), 1)
    range.set(boardToInts('5c5d'), 1)
    const vsRange = new PokerRange()
    vsRange.set(boardToInts('AhKc'), 1)
    vsRange.set(boardToInts('QcQd'), 1)
    // AhAs only faces QcQd (win), 5c5d faces both (win, lose): 3 pairs, 2 wins
    const [win, tie, lose] = rangeVsRangeAhead({
      board: boardToInts('2c3d4h8s9s'),
      range,
      vsRange
    })
    assert.ok(Math.abs(win - 2 / 3) < 1e-9)
    assert.equal(tie, 0)
    assert.ok(Math.abs(lose - 1 / 3) < 1e-9)
  })

  test('aheadPct returns fractions', () => {
    const vsRange = new PokerRange()
    vsRange.set(boardToInts('AcAh'), 3)
    vsRange.set(boardToInts('KcKh'), 1)
    const result = aheadPct(
      { board: boardToInts('2c7d9h4s5s'), hand: boardToInts('KdKs') },
      vsRange
    )
    assert.deepEqual(result, [0, 0.25, 0.75])
  })
})
