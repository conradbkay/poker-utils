import { randUniqueCards } from '../cards/utils'
import { sortCards } from '../sort'
import { any2pre, PreflopRange } from './preflop'
import { getIsoHand } from '../iso'

// todo option to return as isomorphic (would need to have methods to set board then?)

/**
 * `Range` is a DOM Global so we use `PokerRange`
 *
 * enforces that all combos have the same # of cards
 *
 * accessed by and returns (0-51)[] cards
 *
 * every method that takes cards sorts them in-place
 */
export class PokerRange {
  private range: Map<string, number> //Weighted cardStr dict: {"43,20": 0.63}
  private handLen: number

  constructor(handLen = 2) {
    this.handLen = handLen
    this.reset()
  }

  public getSize() {
    return this.range.size
  }

  public getHandLen() {
    return this.handLen
  }

  public reset() {
    this.range = new Map<string, number>()
  }

  public getWeight(hand: number[]) {
    const str = this.toKey(hand)
    return this.range.get(str) || 0
  }

  /**
   * setting weight to 0 deletes entirely
   *
   * throws error if hand is different length than hands already in range
   * */
  public set(hand: number[], weight = 1) {
    if (hand.length !== this.getHandLen()) {
      if (this.range.size) {
        throw new Error(
          `attempting to set ${hand.length} len hand in ${this.getHandLen()} len range`
        )
      } else {
        this.handLen = hand.length
      }
    }

    const str = this.toKey(hand)
    if (!weight) {
      this.range.delete(str)
    } else {
      this.range.set(str, weight)
    }
  }

  /** sorts in place */
  private toKey(cards: number[]) {
    return sortCards(cards).join(',')
  }
  private fromKey(str: string) {
    return str.split(',').map((s) => parseInt(s))
  }

  /** expands preflop categories into their constituent combos */
  public static fromPreflop(preflop: PreflopRange) {
    const result = new PokerRange(2)

    const weights = preflop.getWeights()
    for (let i = 0; i < weights.length; i++) {
      const weight = weights[i]
      const combos = PreflopRange.handCombos(PreflopRange.fromIdx(i))
      for (const combo of combos) {
        result.set(combo, weight)
      }
    }

    return result
  }

  /** doesn't modify original */
  public static iso(range: PokerRange, suitMap = [-1, -1, -1, -1]) {
    let result = new PokerRange()

    range.forEach((hand, w) => {
      const iso = getIsoHand(hand, suitMap)
      result.set(iso, result.getWeight(iso) + w)
    })

    return result
  }

  // faster than Symbol iterator
  public forEach(f: (combo: number[], weight: number) => void) {
    this.range.forEach((v, k) => {
      f(this.fromKey(k), v)
    })
  }

  public map<T>(f: (combo: number[], weight: number) => T) {
    let result = new Array<T>(this.range.size)
    let i = 0
    this.forEach((hand, weight) => {
      result[i] = f(hand, weight)
      i++
    })
    return result
  }
}

export const any2 = PokerRange.fromPreflop(any2pre)

export const genRandRange = (size: number) => {
  const range = new PokerRange(2)
  while (range.getSize() < size) {
    range.set(randUniqueCards(2))
  }
  return range
}
