import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { evaluate as eval2p2 } from '../lib/twoplustwo/evaluate'
import { randCards } from '../benchmarks/utils'
import { cardsToPHE, removeGaps, valueFromPHE } from '../lib/phe/convert'
import { initFromPathSync } from '../lib/init'
import { resolve } from 'path'
import { getPHEValue } from '../lib/phe/evaluate'

initFromPathSync(resolve('./HandRanks.dat'))

describe('PHE <--> 2p2 conversions', () => {
  it('creates equivalent rank values', () => {
    for (let i = 0; i < 10000; i++) {
      const hand = randCards(5, false)
      const tpt = eval2p2(hand).value
      const phe = getPHEValue(cardsToPHE(hand))
      assert.equal(tpt, valueFromPHE(phe))
      assert.equal(7463 - phe, removeGaps(tpt))
    }
  })
})
