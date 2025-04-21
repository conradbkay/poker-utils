import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { evaluate as eval2p2 } from '../lib/twoplustwo/evaluate.js'
import { randCards } from '../benchmarks/utils.js'
import { cardsToPHE, valueFromPHE } from '../lib/phe/convert.js'
import { initFromPathSync } from '../lib/init.js'
import { resolve } from 'path'
import { getPHEValue } from '../lib/phe/evaluate.js'

initFromPathSync(resolve('./HandRanks.dat'))

describe('PHE <--> 2p2 conversions', () => {
  it('creates equivalent rank values', () => {
    for (let i = 0; i < 10000; i++) {
      const hand = randCards(5, false)
      const tpt = eval2p2(hand).value
      const phe = valueFromPHE(getPHEValue(cardsToPHE(hand)))
      assert.equal(tpt, phe)
    }
  })
})
