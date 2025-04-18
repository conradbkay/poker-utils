import Benchmarkify from 'benchmarkify'
import { randCards, time, sequentialCards } from './utils'
import { evaluate, evaluateRank } from '../lib/omp/main'

const benchmark = new Benchmarkify('Equity', {
  chartImage: false
}).printHeader()

benchmark
  .createSuite('ompeval', { time })
  .add('Sequential', () => {
    evaluate(sequentialCards)
  })
  .add('Random 7 cards', () => {
    evaluate(randCards(7))
  })
  .add('Random 7 card ranks', () => {
    evaluateRank(randCards(7))
  })
  .add('Random 5 cards', () => {
    evaluate(randCards(5))
  })

benchmark.run()
