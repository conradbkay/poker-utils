import Benchmarkify from 'benchmarkify'
import { equityEval, omahaAheadScore } from '../lib/eval/equity'
import { boardToInts, shuffleDeck } from '../lib/eval/utils'
import { resolve } from 'path'
import { evalOmaha, evaluate } from '../lib/eval/strength'
import { DECK } from '../lib/eval/constants'
import { ploRange } from '../lib/ranges'

const benchmark = new Benchmarkify('Equity', {
  chartImage: true
}).printHeader()

let deck: number[] = []

const randCards = (count: number) => {
  if (count > deck.length) {
    deck = shuffleDeck(Object.values(DECK))
  }

  return deck.slice(0, count)
}

const ranksFile = resolve('./HandRanks.dat')

// Create a test suite
benchmark
  .createSuite('PLO')
  .add('Ahead Pct River', () => {
    omahaAheadScore({
      board: randCards(5),
      hand: randCards(4),
      ranksFile,
      chopIsWin: true
    })
  })
  .add('Ahead Pct Turn', () => {
    omahaAheadScore({
      board: randCards(4),
      hand: randCards(4),
      ranksFile,
      chopIsWin: true
    })
  })
  .add('Ahead Pct Flop', () => {
    omahaAheadScore({
      board: randCards(3),
      hand: randCards(4),
      ranksFile,
      chopIsWin: true
    })
  })
  .add('Eval NLHE', () => {
    evaluate(randCards(5), ranksFile)
  })
  .add('Eval Omaha', () => {
    evalOmaha(randCards(3), randCards(4), ranksFile)
  })
  .add('Eval PLO5', () => {
    evalOmaha(randCards(3), randCards(5), ranksFile)
  })
  .add('EquityEval Omaha River', () => {
    equityEval({
      board: randCards(5),
      hand: randCards(4),
      ranksFile,
      chopIsWin: true,
      vsRange: ploRange
    })
  })
  .add('EquityEval Omaha Turn', () => {
    equityEval({
      board: randCards(4),
      hand: randCards(4),
      ranksFile,
      chopIsWin: true,
      vsRange: ploRange
    })
  })

benchmark.run()
