import { run, bench, boxplot, summary, do_not_optimize } from 'mitata'
import { genRandHash, randCards, sequentialCards, time } from './utils.js'
import { getPHEValue } from 'lib/phe/evaluate.js'
import { cardsToPHE } from 'lib/phe/convert.js'
import { valueFromPHE } from 'lib/phe/convert.js'
import { canonize, flopIsoRunouts, isoRange, isoRunouts } from 'lib/iso.js'
import { any2, Range } from 'lib/ranges/ranges.js'
import { sortCards } from 'lib/sort.js'
import { evaluate } from 'evaluate.js'
import { combosVsRangeAhead, omahaAheadScore } from 'lib/twoplustwo/equity.js'
import {
  genBoardEval,
  fastEval,
  fastEvalPartial,
  evalOmaha
} from 'lib/twoplustwo/strength.js'
import { resolve } from 'path'
import { initFromPathSync } from 'lib/init.js'

/**
 * todo total memory usage
 * todo total startup time
 */

const markdown =
  process.argv.includes('--markdown') || process.argv.includes('-md') // just run benchmarks for README.md

genRandHash() // for randCards

// sort
bench('Node.js 6 card .sort', () => {
  randCards(6).sort((a, b) => b - a)
})
bench('...`(sortCards)`', () => {
  sortCards(randCards(6))
})

// iso
// ! 40x slower than the original implementation. Maybe change to set an internal suit mapping of the original and always fetch cards based on that
bench('range to isomorphic', () => {
  isoRange(any2)
})
bench('generate river runouts', () => {
  isoRunouts(randCards(4))
})
bench('generate turn+river runouts', () => {
  flopIsoRunouts(randCards(3))
})
bench('flop isomorphism', () => {
  canonize(randCards(3))
})
bench('river isomorphism', () => {
  canonize(randCards(5))
})

if (!markdown) {
  // phe
  bench('cardsToPHE', () => {
    cardsToPHE(sequentialCards)
  })
}

/*bench('phe rand 5 cards', () => {
  getPHEValue(cardsToPHE(randCards(5, false))) // very odd bug making it return 5 of the same rank somehow? Only used in bench so whatever
})*/

// twoplustwo vs phe
// ensure data is loaded BEFORE running benchmarks
const ranksFile = resolve('./HandRanks.dat')
initFromPathSync(ranksFile)

const riverEval = genBoardEval(randCards(5))
const flopEval = genBoardEval(randCards(3))

bench('phe sequential+convert', () => {
  valueFromPHE(getPHEValue(cardsToPHE(sequentialCards)))
})
bench('2p2 sequential', () => {
  fastEval(sequentialCards)
})
bench('phe rand 7 cards', () => {
  getPHEValue(cardsToPHE(randCards(7)))
})
bench('2p2 rand 7 cards', () => {
  fastEval(randCards(7))
})
if (!markdown) {
  bench('...with 5-6 card conditional handling', () => {
    fastEvalPartial(randCards(7))
  })
  bench('...with pInfo overhead', () => {
    evaluate(randCards(7))
  })
}
bench('2p2 random 2 cards on fixed river', () => {
  riverEval(randCards(2))
})
bench('2p2 random 2 cards on fixed flop', () => {
  flopEval(randCards(2))
})
bench('2p2 river full range vs range equity', () => {
  combosVsRangeAhead({
    board: randCards(5),
    range: any2,
    vsRange: any2
  })
})

// twoplustwo omaha
const randomOmahaRange = new Range(4)

while (randomOmahaRange.getSize() < 1000) {
  const add = sortCards(randCards(4))
  randomOmahaRange.set(add, 1)
}

bench('4 card omaha flop hand strength', () => {
  evalOmaha(randCards(3), randCards(4))
})
bench('4 card omaha river hand strength', () => {
  evalOmaha(randCards(5), randCards(4))
})
bench('...5 cards', () => {
  evalOmaha(randCards(5), randCards(5))
})
bench('...6 cards', () => {
  evalOmaha(randCards(5), randCards(6))
})
bench('omaha river equity vs 1000 random hands', () => {
  omahaAheadScore(
    {
      board: randCards(5),
      hand: randCards(4)
    },
    randomOmahaRange
  )
})
bench('omaha turn ahead vs range', () => {
  omahaAheadScore(
    {
      board: randCards(4),
      hand: randCards(4)
    },
    randomOmahaRange
  )
})
// ! 3.5x slower than originally
bench('omaha flop ahead vs range', () => {
  omahaAheadScore(
    {
      board: randCards(3),
      hand: randCards(4)
    },
    randomOmahaRange
  )
})

run(markdown ? { format: 'markdown' } : {})
