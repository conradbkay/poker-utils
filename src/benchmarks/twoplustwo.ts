import Benchmarkify from 'benchmarkify'
import {
  equityEval,
  omahaAheadScore,
  combosVsRangeAhead
} from '../lib/twoplustwo/equity'
import {
  evalOmaha,
  evaluate,
  fastEval,
  fastEvalPartial,
  genBoardEval
} from '../lib/twoplustwo/strength'
import { ploRange, ranges } from '../lib/ranges'
import { randCards, time, sequentialCards } from './utils'
import { resolve } from 'path'
import { initFromPathSync } from '../lib/init'

// ensure data is loaded BEFORE running benchmarks
const ranksFile = resolve('./HandRanks.dat')
initFromPathSync(ranksFile)

const benchmark = new Benchmarkify('Equity', {
  chartImage: false,
  drawChart: false
}).printHeader() // ! have this be the only one to print

const riverEval = genBoardEval(randCards(5))
const flopEval = genBoardEval(randCards(3))

const nlheBench = benchmark
  .createSuite('poker-utils NLHE', { time })
  .add('Sequential fastEval', () => {
    fastEval(sequentialCards)
  })
  .add('Random fastEval', () => {
    fastEval(randCards(7))
  })
  .add('fastEvalPartial', () => {
    fastEvalPartial(randCards(7))
  })
  .add('Hand strength info', () => {
    evaluate(randCards(7))
  })
  .add('riverEval', () => {
    riverEval(randCards(2))
  })
  .add('flopEval', () => {
    flopEval(randCards(2))
  })
  .add('river range equity vs range (1326 combos each)', () => {
    combosVsRangeAhead(randCards(5), ranges['a2c'], ranges['a2c'])
  })

const ploBench = benchmark
  .createSuite('poker-utils Omaha', { time })
  .add('hand strength', () => {
    evalOmaha(randCards(3), randCards(4))
  })
  .add('5card hand strength', () => {
    evalOmaha(randCards(3), randCards(5))
  })
  .add('turn ahead vs range', () => {
    omahaAheadScore({
      board: randCards(4),
      hand: randCards(4),
      chopIsWin: true
    })
  })
  .add('flop ahead vs range', () => {
    omahaAheadScore({
      board: randCards(3),
      hand: randCards(4),
      chopIsWin: true
    })
  })
  .add('river equity vs range', () => {
    omahaAheadScore({
      board: randCards(5),
      hand: randCards(4),
      chopIsWin: true
    })
  })
/* very slow .add('turn equity vs range', () => {
    equityEval({
      board: randCards(4),
      hand: randCards(4),
      chopIsWin: true,
      vsRange: ploRange
    })
  })*/

export default benchmark
