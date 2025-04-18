import { evaluateCardCodes } from 'phe'
import Benchmarkify from 'benchmarkify'
import { randCards, time, sequentialCards } from './utils'

const benchmark = new Benchmarkify('Equity', {
  chartImage: false,
  drawChart: false
})

benchmark
  .createSuite('phe', { time })
  .add('Sequential', () => {
    evaluateCardCodes(sequentialCards)
  })
  .add('Random 7 cards', () => {
    evaluateCardCodes(randCards(7))
  })
  .add('Random 5 cards', () => {
    evaluateCardCodes(randCards(5))
  })

export default benchmark
