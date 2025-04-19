import Benchmarkify from 'benchmarkify'
import { randCards, time } from './utils'
import { canonize, flopIsoRunouts, isoRunouts, sortBoard } from '@lib/iso'
import { flopEquities, rangeToIso } from '@lib/hashing/hash'
import { ranges } from '@lib/ranges/ranges'
import { sortCards } from '@lib/sort'

const benchmark = new Benchmarkify('Hashing', {
  chartImage: false,
  drawChart: false
})

benchmark
  .createSuite('hashing', { time })
  .add('rangeToIso', () => {
    rangeToIso(ranges['a2c'], [-1, -1, -1, -1])
  })
  /*.add('flop equities', () => {
    flopEquities(randCards(3), ranges['a2c'])
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

import './twoplustwo'
benchmark.run()
