import { run, bench, boxplot, summary, do_not_optimize } from 'mitata'
import { genRandHash, randCardsHashed, sequentialCards, time } from './utils.js'
import { getPHEValue } from '../lib/phe/evaluate.js'
import { cardsToPHE } from '../lib/phe/convert.js'
import { valueFromPHE } from '../lib/phe/convert.js'
import { canonize, flopIsoRunouts, isoRange, isoRunouts } from '../lib/iso.js'
import { any2, PokerRange } from '../lib/range/range.js'
import { sortCards } from '../lib/sort.js'
import { evaluate, phe } from '../lib/evaluate.js'
import {
  combosVsRangeAhead,
  fastCombosVsRangeAhead,
  omahaAheadScore
} from '../lib/twoplustwo/equity.js'
import {
  fastEval,
  fastEvalPartial,
  evalOmaha
} from '../lib/twoplustwo/strength.js'
import { genBoardEval } from 'src/lib/evaluate.js'
import { resolve } from 'path'
import { initFromPathSync } from '../lib/init.js'
import { BitRange } from 'src/lib/range/bit.js'

/**
 * todo total memory usage
 * todo total startup time
 */

const markdown =
  process.argv.includes('--markdown') || process.argv.includes('-md') // just run benchmarks for README.md

genRandHash() // for randCards

// sort
bench('Node.js 6 card .sort', () => {
  randCardsHashed(6).sort((a, b) => b - a)
})
bench('...`(sortCards)`', () => {
  sortCards(randCardsHashed(6))
})

// iso
// ! 40x slower than the original implementation. Maybe change to set an internal suit mapping of the original and always fetch cards based on that
bench('range to isomorphic', () => {
  isoRange(any2)
})
bench('generate river runouts', () => {
  isoRunouts(randCardsHashed(4))
})
bench('generate turn+river runouts', () => {
  flopIsoRunouts(randCardsHashed(3))
})
bench('flop isomorphism', () => {
  canonize(randCardsHashed(3))
})
bench('river isomorphism', () => {
  canonize(randCardsHashed(5))
})

if (!markdown) {
  // phe
  bench('cardsToPHE', () => {
    cardsToPHE(sequentialCards)
  })
}

const bitRange = BitRange.fromPokerRange(any2)
const vsBitRange = BitRange.fromPokerRange(any2)

bench('PHE bit range full range vs range equity', () => {
  fastCombosVsRangeAhead({
    board: randCardsHashed(5),
    range: bitRange,
    vsRange: vsBitRange,
    useHandBlockers: false
  })
})

bench('PHE bit range full range vs range equity with handBlockers', () => {
  fastCombosVsRangeAhead({
    board: randCardsHashed(5),
    range: bitRange,
    vsRange: vsBitRange,
    useHandBlockers: true
  })
})

// twoplustwo vs phe
// ensure data is loaded BEFORE running benchmarks
const ranksFile = resolve('./HandRanks.dat')
initFromPathSync(ranksFile)

const riverEval = genBoardEval(randCardsHashed(5))
const flopEval = genBoardEval(randCardsHashed(3))

bench('phe sequential+convert', () => {
  phe(sequentialCards)
})
bench('2p2 sequential', () => {
  fastEval(sequentialCards)
})
bench('phe rand 7 cards', () => {
  getPHEValue(cardsToPHE(randCardsHashed(7)))
})
bench('2p2 rand 7 cards', () => {
  fastEval(randCardsHashed(7))
})
if (!markdown) {
  bench('...with 5-6 card conditional handling', () => {
    fastEvalPartial(randCardsHashed(7))
  })
  bench('...with pInfo overhead', () => {
    evaluate(randCardsHashed(7))
  })
}
bench('2p2 random 2 cards on fixed river', () => {
  riverEval(randCardsHashed(2))
})
bench('2p2 random 2 cards on fixed flop', () => {
  flopEval(randCardsHashed(2))
})
bench('2p2 river full range vs range equity', () => {
  combosVsRangeAhead({
    board: randCardsHashed(5),
    range: any2,
    vsRange: any2
  })
})

// twoplustwo omaha
const randomOmahaRange = new PokerRange(4)

while (randomOmahaRange.getSize() < 1000) {
  const add = sortCards(randCardsHashed(4))
  randomOmahaRange.set(add, 1)
}

bench('4 card omaha flop hand strength', () => {
  evalOmaha(randCardsHashed(3), randCardsHashed(4))
})
bench('4 card omaha river hand strength', () => {
  evalOmaha(randCardsHashed(5), randCardsHashed(4))
})
bench('...5 cards', () => {
  evalOmaha(randCardsHashed(5), randCardsHashed(5))
})
bench('...6 cards', () => {
  evalOmaha(randCardsHashed(5), randCardsHashed(6))
})
bench('omaha river equity vs 1000 random hands', () => {
  omahaAheadScore(
    {
      board: randCardsHashed(5),
      hand: randCardsHashed(4)
    },
    randomOmahaRange
  )
})
bench('omaha turn ahead vs range', () => {
  omahaAheadScore(
    {
      board: randCardsHashed(4),
      hand: randCardsHashed(4)
    },
    randomOmahaRange
  )
})
// ! 3.5x slower than originally
bench('omaha flop ahead vs range', () => {
  omahaAheadScore(
    {
      board: randCardsHashed(3),
      hand: randCardsHashed(4)
    },
    randomOmahaRange
  )
})

run(markdown ? { format: 'markdown' } : {})
