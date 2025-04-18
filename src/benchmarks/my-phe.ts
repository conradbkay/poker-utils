import Benchmarkify from 'benchmarkify'
import { randCards, time, sequentialCards } from './utils'
import { evaluate } from '../lib/phe/evaluate'

const benchmark = new Benchmarkify('Equity', {
  chartImage: false
}).printHeader()

benchmark
  .createSuite('phe.ts', { time })
  .add('Sequential', () => {
    evaluate(sequentialCards)
  })
  .add('Random 7 cards', () => {
    evaluate(randCards(7))
  })
  .add('Random 5 cards', () => {
    evaluate(randCards(5))
  })

benchmark.run()
