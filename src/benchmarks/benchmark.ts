import { run, bench, boxplot, summary, do_not_optimize } from 'mitata'
import { genRandHash, randCardsHashed, sequentialCards } from './utils.js'
import { getPHEValue } from '../lib/phe/evaluate.js'
import { cardsToPHE } from '../lib/phe/convert.js'
import { canonize, isoRunouts } from '../lib/iso.js'
import { any2, genRandRange, PokerRange } from '../lib/range/range.js'
import { sortCards } from '../lib/sort.js'
import { evaluate, phe } from '../lib/evaluate.js'
import { omahaAheadScore } from '../lib/twoplustwo/equity.js'
import {
  fastEval,
  fastEvalPartial,
  evalOmaha
} from '../lib/twoplustwo/strength.js'
import { genBoardEval } from 'src/lib/evaluate.js'
import { resolve } from 'path'
import { initFromPathSync } from '../lib/init.js'
import { readFileSync } from 'fs'
import { HoldemRange } from '../lib/range/holdem.js'

const { version } = JSON.parse(readFileSync(resolve('package.json'), 'utf8'))

/**
 * todo memory usage
 * todo startup time
 */

const readme =
  process.argv.includes('--markdown') || process.argv.includes('-md') // just run benchmarks for README.md

genRandHash()
initFromPathSync(resolve('./HandRanks.dat'))

const holdemAny2 = HoldemRange.fromPokerRange(any2)
bench('2p2 range vs range river equity', () => {
  holdemAny2.equityVsRange({
    board: randCardsHashed(5),
    vsRange: holdemAny2
  })
})

const sparse = HoldemRange.fromPokerRange(genRandRange(100))
const sparse2 = HoldemRange.fromPokerRange(genRandRange(100))
bench('...sparser ranges (random 100 combos)', () => {
  sparse.equityVsRange({
    board: randCardsHashed(5),
    vsRange: sparse2
  })
})

// sort
bench('Node.js 7 cards .sort', () => {
  randCardsHashed(7).sort((a, b) => b - a)
})
bench('poker-utils 7 cards sortCards()', () => {
  sortCards(randCardsHashed(7))
})

// iso
// ! 40x slower than the original implementation. Maybe change to set an internal suit mapping of the original and always fetch cards based on that
bench('full range to isomorphic', () => {
  PokerRange.iso(any2)
})
if (!readme) {
  bench('generate river runouts', () => {
    isoRunouts(randCardsHashed(4))
  })
}
bench('generate turn+river runouts', () => {
  isoRunouts(randCardsHashed(3))
})
bench('flop isomorphism', () => {
  canonize(randCardsHashed(3))
})
if (!readme) {
  bench('river isomorphism', () => {
    canonize(randCardsHashed(5))
  })
}

if (!readme) {
  // phe
  bench('cardsToPHE', () => {
    cardsToPHE(sequentialCards)
  })
}

// twoplustwo vs phe

const riverEval = genBoardEval(randCardsHashed(5))
const flop = randCardsHashed(3)

bench('phe rand 7 cards', () => {
  getPHEValue(cardsToPHE(randCardsHashed(7)))
})
bench('2p2 rand 7 cards', () => {
  fastEval(randCardsHashed(7))
})
if (!readme) {
  bench('...with 5-6 card conditional handling', () => {
    fastEvalPartial(randCardsHashed(7))
  })
  bench('...with pInfo overhead', () => {
    evaluate(randCardsHashed(7))
  })

  bench('phe sequential+convert', () => {
    phe(sequentialCards)
  })
  bench('2p2 sequential', () => {
    fastEval(sequentialCards)
  })
}
bench('2p2 random 2 cards on fixed river', () => {
  riverEval(randCardsHashed(2))
})

// doesn't bother checking for duplicate cards, so it's 52^2
bench('2p2 all combos all runouts after flop (~7.3m evals)', () => {
  for (let turn = 0; turn < 52; turn++) {
    for (let river = 0; river < 52; river++) {
      const runout = [...flop, turn, river]
      const runoutEval = genBoardEval(runout)
      for (let c1 = 0; c1 < 52; c1++) {
        for (let c2 = 0; c2 < 52; c2++) {
          runoutEval([c2, c1])
        }
      }
    }
  }
})

// twoplustwo omaha. Maybe just print as a separate table?
if (!readme) {
  const randomOmahaRange = new PokerRange(4)

  while (randomOmahaRange.getSize() < 1000) {
    const add = sortCards(randCardsHashed(4))
    randomOmahaRange.set(add, 1)
  }

  bench('omaha flop hand strength', () => {
    evalOmaha(randCardsHashed(3), randCardsHashed(4))
  })
  bench('omaha river hand strength', () => {
    evalOmaha(randCardsHashed(5), randCardsHashed(4))
  })
  bench('...5 card omaha river', () => {
    evalOmaha(randCardsHashed(5), randCardsHashed(5))
  })
  bench('...6 card omaha river', () => {
    evalOmaha(randCardsHashed(5), randCardsHashed(6))
  })
  bench('omaha river equity vs 1k random combos', () => {
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
}

const formatTime = (ns: number): string => {
  if (ns < 1000) return `${ns.toFixed(2)}ns`
  if (ns < 1000000) return `${(ns / 1000).toFixed(2)}µs`
  return `${(ns / 1000000).toFixed(2)}ms`
}

run(readme ? { format: 'markdown' } : { format: 'mitata' }).then((result) => {
  console.log(`Ran using \`mitata\` for \`poker-utils v${version}\`\n`)
  console.log('arch:', result.context.arch)
  console.log(`clk: ~${Math.round(result.context.cpu.freq)} GHz`)
  //console.log('cpu:', result.context.cpu.name)
  console.log('Node.js', process.version)

  // Custom output showing only avg and p99 as markdown table
  const longestName = Math.max(
    ...result.benchmarks.flatMap((b) => b.runs.map((r) => r.name.length))
  )
  const rowLengths = [longestName + 2, 13, 13]
  const headers = ['Benchmark', 'Mean', 'p99']
  console.log(
    '\n' +
      headers.map((h, i) => `| ${h.padEnd(rowLengths[i] - 2)} `).join('') +
      '|'
  )
  console.log(rowLengths.map((n) => `|${'-'.repeat(n)}`).join('') + '|')

  result.benchmarks.forEach((trial) => {
    trial.runs.forEach((run) => {
      if (run.stats) {
        const headers = [
          run.name,
          formatTime(run.stats.avg),
          formatTime(run.stats.p99)
        ]

        // only runtime in ``
        const formattedHeaders = headers.map(
          (h, i) => '| ' + (i > 0 ? `\`${h}\`` : h)
        )

        console.log(
          formattedHeaders.map((h, i) => h.padEnd(rowLengths[i] + 1)).join('') +
            '|'
        )
      }
    })
  })
})
