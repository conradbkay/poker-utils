import test from 'ava'
import { flops } from './flops'
import { boardToUnique, handToUnique } from './hash'
import { convertCardsToNumbers } from '../eval/strength'

const genAllFlops = () => {
  const result: number[][] = []

  for (let i = 1; i <= 50; i++) {
    for (let j = i + 1; j <= 51; j++) {
      for (let k = j + 1; k <= 52; k++) {
        result.push([k, j, i])
      }
    }
  }

  return result
}

const allFlops = genAllFlops()

test('flop hash', (t) => {
  const flopStrs = flops.map((f) => f[0])

  for (const flop of allFlops) {
    const flopStr = boardToUnique(flop).join('')

    t.assert(flopStrs.includes(flopStr), flopStr)
  }
})

test('hand isomorphism', (t) => {
  const board = [22, 24, 51]
  t.assert(
    handToUnique([43, 42], convertCardsToNumbers(boardToUnique(board)), board)
  )
})
