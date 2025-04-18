import { shuffleDeck } from '../lib/eval/utils'
import { DECK } from '../lib/twoplustwo/constants'

// for benchmarks we don't want it wasting time generating random cards, but setting to specific card values might (test this though) make it cheat by storing everything in cache
const randHash: Record<string, number[][]> = {}
let created = false
let deck: number[] = []

const accessCards = (count: number) => {
  if (count > deck.length) {
    deck = shuffleDeck(Object.values(DECK))
  }
  return deck.splice(0, count)
}

const [min, max] = [2, 7] as const
const genRandHash = () => {
  for (let i = min; i <= max; i++) {
    randHash[i] ??= []
    // enough to limit caching
    for (let j = 0; j < 1000000; j++) {
      randHash[i].push(accessCards[i])
    }
  }
  created = true
}

let idx = Object.fromEntries(Object.entries(randHash).map(([key]) => [key, -1])) // gets incremented before access
export const randCards = (count: number, hash = true) => {
  if (!hash || count < min || count > max) {
    return accessCards(count)
  }
  if (!created) {
    genRandHash()
  }
  idx[count]++
  const rand = randHash[count]
  return rand[idx[count] % rand.length]
}

export const time = 1000 // ms benchmarks per

export const sequentialCards = randCards(7) // running on same data every time will increase caching and remove overhead of accessing from randHash
