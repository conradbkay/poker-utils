import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { evaluate as eval2p2 } from '../lib/twoplustwo/evaluate.js'
import { randCards } from '../benchmarks/utils.js'
import { addGaps, cardsToPHE, valueFromPHE } from '../lib/phe/convert.js'
import { initFromPathSync } from '../lib/init.js'
import { resolve } from 'path'
import { getPHEValue } from '../lib/phe/evaluate.js'
import { randomInt } from 'node:crypto'

initFromPathSync(resolve('./HandRanks.dat'))
describe('PHE <--> 2p2 conversions', () => {
  it('creates equivalent rank values', () => {
    for (let i = 0; i < 5000; i++) {
      const hand = randCards(randomInt(5, 8), false)
      const tpt = eval2p2(hand)
      const phe = valueFromPHE(getPHEValue(cardsToPHE(hand)))
      assert.equal(tpt.value, phe)
      assert.equal(tpt.p, addGaps(phe))
    }
  })
})
