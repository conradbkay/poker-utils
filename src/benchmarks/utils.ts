import { randUniqueCards, shuffle } from '../lib/cards/utils'
import { CARDS } from '../lib/constants'

// for benchmarks we don't want it wasting time generating random cards, but setting to specific card values might (test this though) make it cheat by storing everything in cache
const randHash: Record<string, number[][]> = {}
let idx = {}
let created = false
let deck: number[] = []
const accessCards = (count: number) => {
  if (count > deck.length) {
    deck = shuffle([...CARDS])
  }
  return deck.splice(0, count)
}

const [min, max] = [2, 7] as const
export const genRandHash = () => {
  for (let i = min; i <= max; i++) {
    randHash[i] ??= []
    // 1m is better to limit caching but takes ~1s
    for (let j = 0; j < 100000; j++) {
      randHash[i].push(accessCards(i))
    }
  }

  idx = Object.fromEntries(Object.entries(randHash).map(([key]) => [key, -1])) // gets incremented before access

  created = true
}

export const randCardsHashed = (count: number) => {
  if (!created) {
    genRandHash()
  }

  idx[count]++
  const rand = randHash[count]
  return rand[idx[count] % (rand.length - 1)]
}

export const time = 1000 // ms benchmarks per

export const sequentialCards = randUniqueCards(7) // running on same data every time will increase caching and remove overhead of accessing from randHash
