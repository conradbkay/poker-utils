import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import { fromHandIdx, genCardCombinations, getHandIdx } from '../lib/utils.js'
import { sortCards } from 'lib/sort.js'

const allFlops = genCardCombinations(3)
const allHands = genCardCombinations(2)

describe('hashing', () => {
  test('getHandIdx', (t) => {
    let found = new Map<number, number>()

    for (let a = 52; a > 1; a--) {
      for (let b = a - 1; b >= 1; b--) {
        const hand = Math.random() > 0.5 ? [a, b] : [b, a]
        const idx = getHandIdx(hand)
        found.set(idx, (found.get(idx) || 0) + 1)

        if (found.get(idx) > 1) {
          throw new Error('more than 1 combo mapping to same idx')
        }
        assert.deepEqual(sortCards(hand), fromHandIdx(idx))
      }
    }

    assert.equal(found.size, 1326)
  })

  test('genCardCombinations', (t) => {
    assert.equal(allFlops.length, (52 * 51 * 50) / 6)
    assert.equal(allHands.length, (52 * 51) / 2)
  })
})
