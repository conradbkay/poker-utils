import test from 'ava'
import { random } from 'lodash'
import { flops } from './flops'
import { boardToUnique, handToUnique } from './hash'
import { convertCardsToNumbers } from '../eval/utils'

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
  for (let i = 0; i < 1000; i++) {
    const board = new Array(3)
      .fill(0)
      .map(() => random(1, 52, false))
      .sort((a, b) => b - a)
    const hand = new Array(2)
      .fill(0)
      .map(() => random(1, 52, false))
      .sort((a, b) => b - a)

    if (new Set([...board, ...hand]).size !== 5) {
      continue
    }

    t.assert(
      handToUnique(hand, convertCardsToNumbers(boardToUnique(board)), board)
    )
  }
})
