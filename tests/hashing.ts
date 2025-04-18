import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { flops } from '@lib/hashing/flops'
import { genCardCombinations } from '@lib/utils'
import { isoBoard, isoHand } from '@lib/iso'
import { getHandIdx } from '@lib/utils'
import { pioFlops } from '../data/pioFlops'

const allFlops = genCardCombinations(3)
const allHands = genCardCombinations(2)

test('getHandIdx', (t) => {
  let found = new Set<number>()

  for (let a = 52; a > 1; a--) {
    for (let b = a - 1; b >= 1; b--) {
      found.add(getHandIdx(Math.random() > 0.5 ? [a, b] : [b, a]))
    }
  }

  assert.equal(found.size, 1326)
})

test('card combinations', (t) => {
  assert.equal(allFlops.length, (52 * 51 * 50) / 6)
  assert.equal(allHands.length, (52 * 51) / 2)
})

describe('flop isomorphism', (t) => {
  it('generates 1755 unique flops', () => {
    assert.equal(flops.length, 1755)
  })

  it('equals pio flops', () => {
    const flopStrs = flops.map((f) => f[0])
    const pioStrs = pioFlops.map((f) => f[0])

    for (let i = 0; i < flopStrs.length; i++) {
      assert.equal(pioStrs.includes(flopStrs[i]), true)
    }
  })

  it('generates 169 unique preflop combos', () => {
    const unique = new Set(allHands.map((h) => isoHand(h).join(' ')))
    assert.equal(unique.size, 169)
  })
})
