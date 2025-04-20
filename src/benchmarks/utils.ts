import { shuffle } from '../lib/cards/utils.js'
import { ALL_CARDS, DECK } from '../lib/twoplustwo/constants.js'

// for benchmarks we don't want it wasting time generating random cards, but setting to specific card values might (test this though) make it cheat by storing everything in cache
const randHash: Record<string, number[][]> = {}
let idx = {}
let created = false
let deck: number[] = []
const accessCards = (count: number) => {
  if (count > deck.length) {
    deck = shuffle([...ALL_CARDS])
  }
  return deck.splice(0, count)
}

const [min, max] = [2, 7] as const
const genRandHash = () => {
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

export const randCards = (count: number, hash = true) => {
  if (!hash || count < min || count > max) {
    return accessCards(count)
  }
  if (!created) {
    genRandHash()
  }

  idx[count]++
  const rand = randHash[count]
  return rand[idx[count] % (rand.length - 1)]
}

export const time = 1000 // ms benchmarks per

export const sequentialCards = randCards(7, false) // running on same data every time will increase caching and remove overhead of accessing from randHash
