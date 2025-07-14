import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { allFlops, flopIsoBoards, flops } from '../lib/hashing/flops'
import { getIsoHand, isoRunouts, totalIsoWeight } from '../lib/iso'
import { pioFlops } from './data/pioFlops'
import { genCardCombinations } from '../lib/utils'
import { makeCard, randUniqueCards, shuffle } from '../lib/cards/utils'

const allHands = genCardCombinations(2)

describe('isomorphism', () => {
  it('generates 1755 unique flops from 22100', () => {
    assert.equal(allFlops.length, 22100)
    assert.equal(flops.length, 1755)
    assert.equal(flopIsoBoards.length, 1755)
  })

  it('generates flops in PioSOLVER format', () => {
    const flopStrs = flops.map((f) => f[0])

    for (let i = 0; i < flopStrs.length; i++) {
      assert.equal(pioFlops.includes(flopStrs[i]), true)
    }
  })

  it('generates 169 unique preflop combos from 1326', () => {
    assert.equal(allHands.length, 1326)
    const unique = new Set(allHands.map((h) => getIsoHand(h).join(' ')))
    assert.equal(unique.size, 169)
  })
})

describe('runouts', () => {
  it('generates total weight of 49 for turn runouts', () => {
    const weightSum = totalIsoWeight(
      isoRunouts(randUniqueCards(3), undefined, false)
    )
    assert.equal(weightSum, 49)
  })
  it('generates total weight of 49*49 for turn+river runouts', () => {
    const weightSum = totalIsoWeight(isoRunouts(randUniqueCards(3)))
    assert.equal(weightSum, 49 * 49)
  })
  it('generates 23 turns for monotone flops', () => {
    for (let i = 0; i < 1000; i++) {
      const mono = generateFlopWithNSuits(1)
      const turns = isoRunouts(mono)
      assert.equal(Object.keys(turns).length, 23)
    }
  })
  it('generates 36 turns f0or two-tone flops', () => {
    for (let i = 0; i < 1000; i++) {
      const tt = generateFlopWithNSuits(2)
      const turns = isoRunouts(tt)
      assert.equal(Object.keys(turns).length, 36)
    }
  })
  it('generates 49 turns for rainbow flops', () => {
    for (let i = 0; i < 1000; i++) {
      const rainbow = generateFlopWithNSuits(3)
      const turns = isoRunouts(rainbow)
      assert.equal(Object.keys(turns).length, 49)
    }
  })
})

// ai slop but it works and is ignorable
/**
 * Generates a random flop (3 cards) with exactly n unique suits
 * @param n Number of unique suits (1-3 for flops)
 * @returns Array of 3 card numbers representing the flop
 */
export const generateFlopWithNSuits = (n: number): number[] => {
  if (n < 1 || n > 3) {
    throw new Error('n must be between 1 and 3 for flops')
  }

  const allRanks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] // 2 through Ace
  const allSuits = [0, 1, 2, 3] // spades, hearts, diamonds, clubs

  if (n === 1) {
    // Monotone flop - all cards same suit
    const suit = allSuits[Math.floor(Math.random() * 4)]
    const shuffledRanks = shuffle([...allRanks])
    return [
      makeCard(shuffledRanks[0], suit),
      makeCard(shuffledRanks[1], suit),
      makeCard(shuffledRanks[2], suit)
    ]
  } else if (n === 2) {
    // Two-tone flop - 2 cards of one suit, 1 of another
    const shuffledSuits = shuffle([...allSuits])
    const suit1 = shuffledSuits[0]
    const suit2 = shuffledSuits[1]

    const shuffledRanks = shuffle([...allRanks])

    return [
      makeCard(shuffledRanks[0], suit1),
      makeCard(shuffledRanks[1], suit1),
      makeCard(shuffledRanks[2], suit2)
    ]
  } else {
    // Rainbow flop - all cards different suits
    const shuffledSuits = shuffle([...allSuits])
    const shuffledRanks = shuffle([...allRanks])

    return [
      makeCard(shuffledRanks[0], shuffledSuits[0]),
      makeCard(shuffledRanks[1], shuffledSuits[1]),
      makeCard(shuffledRanks[2], shuffledSuits[2])
    ]
  }
}
