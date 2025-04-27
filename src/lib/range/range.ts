import { sortCards } from '../sort.js'
import { fromHandIdx, getHandIdx } from '../utils.js'
import { any2pre, PreflopRange } from './preflop.js'

// todo option to return as isomorphic (would need to have methods to set board then?)

/**
 * enforces that all combos have the same # of cards
 *
 * accessed by and returns (1-52)[] cards
 *
 * every method that takes cards sorts them in-place
 */
// `Range` is a DOM Global
export class PokerRange {
  private range: Map<string, number> //Weighted cardStr dict: {"43,20": 0.63}
  private handLen: number
  private board?: number[]

  constructor(handLen = 2, board?: number[]) {
    this.handLen = handLen
    this.board = board
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
        console.warn(
          `Changing empty range from ${this.getHandLen()} to ${hand.length} length`
        )

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

  /** returns all combos in this range but not in `compare` */
  public advantage(compare: PokerRange) {
    const rIdxs = this.map((hand) => getHandIdx(hand))
    const cIdxs = compare.map((hand) => getHandIdx(hand))
    const rSet = new Set(rIdxs)
    const cSet = new Set(cIdxs)
    const idxs = Array.from(new Set([...rIdxs, ...cIdxs]))
    return idxs.filter((c) => !rSet.has(c) || !cSet.has(c)).map(fromHandIdx)
  }

  /** returns all combos in only one range */
  public asymmetry(compare: PokerRange) {
    return [...this.advantage(compare), ...compare.advantage(this)]
  }

  /** what percent of total combos are shared */
  public overlap(compare: PokerRange) {
    const asymm = this.asymmetry(compare)
    const dissim = asymm.length / (this.getSize() + compare.getSize())
    return 1 - dissim
  }

  // todo just do iterator override
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

// maybe want this to actually be reasonably usable with just 1 range?
/**
 * does blockers and isomorphism
 */
export class PokerRanges {
  private board: number[]
  private ranges: PokerRange[]

  constructor(board: number[], ranges: PokerRange[] = []) {
    this.board = board
    this.ranges = ranges
  }
}
