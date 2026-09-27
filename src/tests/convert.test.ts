import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  genOmahaBoardEval,
  twoplustwoEvaluate as eval2p2
} from 'src/lib/twoplustwo/strength'
import { cardsToPHE, valueFromPHE } from '../lib/phe/convert'
import { initFromPathSync } from '../lib/init'
import { resolve } from 'path'
import { getPHEValue } from '../lib/phe/evaluate'
import { randomInt } from 'node:crypto'
import { evalOmaha, phe } from '../lib/evaluate'
import { boardToInts, randUniqueCards } from '../lib/cards/utils'

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

describe('genOmahaBoardEval', () => {
  it('uses exactly 2 hole cards, matching evalOmaha', () => {
    // AsJsTs3s can't make the Ks Qs straight flush with 4 hole cards
    const board = boardToInts('2c7d9hKsQs')
    const hand = boardToInts('AsJsTs3s')
    assert.equal(genOmahaBoardEval(board)(hand), evalOmaha(board, hand).p)

    for (let i = 0; i < 1000; i++) {
      const cards = randUniqueCards(9)
      const [board, hand] = [cards.slice(0, 5), cards.slice(5)]
      assert.equal(genOmahaBoardEval(board)(hand), evalOmaha(board, hand).p)
    }
  })
})
