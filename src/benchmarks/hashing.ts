import Benchmarkify from 'benchmarkify'
import { randCards, time } from './utils'
import { canonize, flopIsoRunouts, isoRunouts, sortBoard } from '../iso'
import { flopEquities, rangeToIso } from '../hashing/hash'
import { any2 } from '../ranges/ranges'
import { sortCards } from '../sort'

const benchmark = new Benchmarkify('Hashing', {
  chartImage: false,
  drawChart: false
})

benchmark
  .createSuite('hashing', { time })
  .add('rangeToIso', () => {
    rangeToIso(any2, [-1, -1, -1, -1])
  })
  /*.add('flop equities', () => {
    flopEquities(randCards(3), any2)
  })*/
  .add('6 card sort', () => {
    sortCards(randCards(6))
  })
  .add('native JS 6 card sort', () => {
    randCards(6).sort((a, b) => b - a)
  })
  .add('river runouts', () => {
    isoRunouts(randCards(4))
  })
  .add('turn+river runouts', () => {
    flopIsoRunouts(randCards(3))
  })
  .add('flop isomorphism', () => {
    canonize(randCards(3))
  })
  .add('river isomorphism', () => {
    canonize(randCards(5))
  })

export default benchmark
