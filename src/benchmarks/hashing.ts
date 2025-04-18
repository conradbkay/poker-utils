import Benchmarkify from 'benchmarkify'
import { randCards, time } from './utils'
import { canonize, sortBoard, sortCards } from '@lib/iso'

const benchmark = new Benchmarkify('Hashing', {
  chartImage: false
}).printHeader()

benchmark
  .createSuite('hashing', { time })
  .add('hand isomorphism', () => {
    canonize(randCards(2))
  })
  .add('flop isomorphism', () => {
    canonize(randCards(3))
  })
  .add('river isomorphism', () => {
    canonize(randCards(5))
  })

benchmark.run()
