import { PreflopRange } from './range/preflop.js'
import { boardToInts, formatCards } from './cards/utils.js'
import { evaluate } from './evaluate.js'
import { iso } from './iso.js'

const preRange = new PreflopRange()
preRange.set('66')
preRange.set('AKs', 0.5)
preRange.toString() // "AKs:0.5,66"
preRange.getWeight('AKs') // 0.5

const { board, hand } = iso({
  board: boardToInts('Kh9c4s3c5h'),
  hand: boardToInts('3d3s')
})
console.log(formatCards(board)) // [ 'Ks', '9h', '4d', '3h', '5s' ]
console.log(formatCards(hand)) // [ '3d', '3c' ]

const evaluated = evaluate([...board, ...hand])

console.log(evaluated) /*{
  handType: 4,
  handRank: 118,
  p: 16502,
  value: 5113,
  handName: 'Three of a Kind'
}*/
