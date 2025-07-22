import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { twoplustwoEvaluate as eval2p2 } from 'src/lib/twoplustwo/strength'
import { cardsToPHE, valueFromPHE } from '../lib/phe/convert'
import { initFromPathSync } from '../lib/init'
import { resolve } from 'path'
import { getPHEValue } from '../lib/phe/evaluate'
import { randomInt } from 'node:crypto'
import { phe } from '../lib/evaluate'
import { randUniqueCards } from '../lib/cards/utils'

initFromPathSync(resolve('./HandRanks.dat'))
describe('PHE <--> 2p2 conversions', () => {
  it('creates equivalent rank values', () => {
    for (let i = 0; i < 5000; i++) {
      const hand = randUniqueCards(randomInt(5, 8))
      const tpt = eval2p2(hand)
      const pheValue = valueFromPHE(getPHEValue(cardsToPHE(hand)))
      const pheP = phe(hand)
      assert.equal(tpt.value, pheValue)
      assert.equal(tpt.p, pheP)
    }
  })
})
