import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { allFlops, flopIsoBoards, flops } from '../lib/hashing/flops'
import { flopIsoRunouts, isoHand, isoRunouts, totalIsoWeight } from '../lib/iso'
import { pioFlops } from '../data/pioFlops'
import { genCardCombinations } from '../lib/utils'
import { randCards } from '../benchmarks/utils'
import { boardToInts } from '../lib/cards/utils'

const allHands = genCardCombinations(2)

describe('flop isomorphism', (t) => {
  it('generates 1755 unique flops from 22100', () => {
    assert.equal(allFlops.length, 22100)
    assert.equal(flops.length, 1755)
    assert.equal(flopIsoBoards.length, 1755)
  })

  it('generates flops in PioSOLVER format', () => {
    const flopStrs = flops.map((f) => f[0])
    const pioStrs = pioFlops.map((f) => f[0])

    for (let i = 0; i < flopStrs.length; i++) {
      assert.equal(pioStrs.includes(flopStrs[i]), true)
    }
  })

  it('generates 169 unique preflop combos from 1326', () => {
    assert.equal(allHands.length, 1326)
    const unique = new Set(allHands.map((h) => isoHand(h).join(' ')))
    assert.equal(unique.size, 169)
  })
})

const [rainbow, tt, mono] = [
  boardToInts('Jc9s3h'),
  boardToInts('Jc9c3s'),
  boardToInts('Jh9h3h')
]

describe('runouts', () => {
  it('generates total weight of 49 for turn runouts', () => {
    const weightSum = totalIsoWeight(isoRunouts(randCards(3)))
    assert.equal(weightSum, 49)
  })
  it('generates total weight of 49*49 for turn+river runouts', () => {
    const weightSum = totalIsoWeight(flopIsoRunouts(randCards(3)))
    assert.equal(weightSum, 49 * 49)
  })
  it('generates 23 turns for monotone flop', () => {
    const turns = isoRunouts(mono)
    assert.equal(Object.keys(turns).length, 23)
  })
  it('generates 36 turns for two-tone flop', () => {
    const turns = isoRunouts(tt)
    assert.equal(Object.keys(turns).length, 36)
  })
  it('generates 49 turns for rainbow flop', () => {
    const turns = isoRunouts(rainbow)
    assert.equal(Object.keys(turns).length, 49)
  })
})
