import Benchmarkify from 'benchmarkify'
import { randCards, time, sequentialCards } from './utils'
import { evaluate } from '../lib/phe/evaluate'
import { cardsToPHE, toPHE } from '@lib/phe/convert'
import { valueFromPHE } from '@lib/phe/convert'
const benchmark = new Benchmarkify('Equity', {
  chartImage: false,
  drawChart: false
})

benchmark
  .createSuite('phe.ts', { time })
  .add('cards to PHE', () => {
    cardsToPHE(sequentialCards)
  })
  .add('Sequential', () => {
    evaluate(cardsToPHE(sequentialCards))
  })
  .add('Sequential + convert', () => {
    valueFromPHE(evaluate(cardsToPHE(sequentialCards)))
  })
  .add('Random 7 cards', () => {
    evaluate(cardsToPHE(randCards(7)))
  })
  .add('Random 5 cards', () => {
    evaluate(cardsToPHE(randCards(5, false))) // somehow this is causing 5 cards of the same rank to be passed sometimes. Only when this benchmark is ran last so something to do with randCards hash. Not super urgent since only used for testing
  })

export default benchmark
