import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { any2 } from '../lib/range/range.js'
import { any2pre, PreflopRange } from '../lib/range/preflop.js'
import { PokerRange } from '../lib/range/range.js'
import { formatCards, randUniqueCards } from '../lib/cards/utils.js'

describe('PreflopRange', (t) => {
  test('any2pre percentiles is [0,1]', () => {
    assert.deepEqual([0, 1], any2pre.toPercentiles())
  })

  const pf = new PreflopRange()

  it('instantiates as empty 169 weights', () => {
    const w = pf.getWeights()
    assert.equal(w.length, 169)
    assert.equal(
      w.reduce((a, c) => a + c),
      0
    )
  })

  test('AA maps to 1st idx', () => {
    pf.set('AA', 0.5)
    assert.equal(pf.getWeight('AA'), 0.5)
    assert.equal(pf.getWeights()[0], 0.5)
  })

  let outStr = ''
  test('toString', () => {
    pf.set('33', 1)
    pf.set('AKs', 0.3)
    pf.set('44', 0)
    outStr = pf.toString()
    assert.equal(outStr, 'AA:0.5,AKs:0.3,33')
  })

  test('fromString', () => {
    const fromString = PreflopRange.fromStr(outStr)
    assert.deepEqual(fromString.getWeights(), pf.getWeights())
  })

  test('handCombos', () => {
    assert.deepEqual(
      PreflopRange.handCombos('22').map((c) => formatCards(c).join('')),
      ['2s2h', '2s2d', '2s2c', '2h2d', '2h2c', '2d2c']
    )
  })

  test('fromPercentiles/toPercentiles run without error', () => {
    const percentiled = PreflopRange.fromPercentiles(0.5, 0.6)
    // todo fix assert.deepEqual(percentiled.toPercentiles(), [0.3, 0.5])
  })
})

describe('PokerRange', (t) => {
  test('any2 is 1326 combos', () => {
    assert.equal(any2.getSize(), 1326)
  })

  const r = new PokerRange() // following tests depend on eachother
  it('instantiates as empty', () => {
    assert.equal(r.getSize(), 0)
  })

  it('can set combo weight any number, and delete by trying to set weight to 0', () => {
    const hand = randUniqueCards(2)
    const weight = Math.random() * 20
    r.set(hand, weight)
    assert.equal(r.getWeight(hand), weight)
    assert.equal(r.getSize(), 1)
    r.set(hand, 0)
    assert.equal(r.getSize(), 0)
  })

  // todo test advantage, asymmetry, overlap

  it('handles inserting lots of combos', () => {
    for (let i = 0; i < 5000; i++) {
      r.set(randUniqueCards(2))
    }
    assert.ok(r.getSize() < 1326)
  })

  it('throws on inserting 4 card into existing 2 card range', () => {
    assert.throws(() => {
      r.set(randUniqueCards(4))
    })
  })

  it('resets to empty', () => {
    r.reset()
    assert.equal(r.getSize(), 0)
  })

  it('can insert PLO range to empty and len changes to 4', () => {
    r.set(randUniqueCards(4))
    assert.equal(r.getHandLen(), 4)
  })
})
