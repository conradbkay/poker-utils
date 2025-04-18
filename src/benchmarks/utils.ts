import { shuffleDeck } from '../lib/eval/utils'
import { DECK } from '../lib/twoplustwo/constants'

// for benchmarks we don't want it wasting time generating random cards, but setting to specific card values might (test this though) make it cheat by storing everything in CPU cache
const randHash: Record<string, number[][]> = {}
let deck: number[] = []
for (let i = 2; i <= 7; i++) {
  randHash[i] ??= []
  // enough to limit caching
  for (let j = 0; j < 1000000; j++) {
    if (i > deck.length) {
      deck = shuffleDeck(Object.values(DECK))
    }

    randHash[i].push(deck.splice(0, i))
  }
}

let idx = Object.fromEntries(Object.entries(randHash).map(([key]) => [key, -1])) // gets incremented before access
export const randCards = (count: number) => {
  idx[count]++
  const rand = randHash[count]
  return rand[idx[count] % rand.length]
}

export const time = 1000 // ms benchmarks per

export const sequentialCards = randCards(7) // running on same data every time will increase caching and remove overhead of accessing from randHash
