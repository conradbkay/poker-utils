import { getRank, getSuit } from '../cards/utils.js'
import { sortCards } from '../sort.js'
import { fromHandIdx, genCardCombinations, getHandIdx } from '../utils.js'
import { DECK, RANKS } from 'lib/constants.js'
import { makeCard } from 'lib/cards/utils.js'

/**
 * there are two types of ranges
 * Preflop isomorphic: 43s/66/KTo encoded as 169 weights
 * Weighted cardStr dict: {"43,20": 0.63}
 */

/**
 * todo option to return as isomorphic (would need to have methods to set board then?)
 */
export class Range {
  private range: Map<string, number>
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
    const str = this.toCardsStr(hand)
    return this.range.get(str) || 0
  }

  public set(hand: number[], weight = 1) {
    if (hand.length !== this.handLen) {
      throw new Error(
        `attempting to set ${hand.length} len hand in ${this.handLen} len range`
      )
    }
    const str = this.toCardsStr(hand)
    if (!weight) {
      this.range.delete(str)
    } else {
      this.range.set(str, weight)
    }
  }

  private toCardsStr(cards: number[]) {
    return cards.join(',')
  }

  private fromCardsStr(str: string) {
    return str.split(',').map((s) => parseInt(s))
  }

  public forEach(f: (combo: number[], weight: number) => void) {
    this.range.forEach((v, k) => {
      f(this.fromCardsStr(k), v)
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

  public createFromPreflop(preflop: PreflopRange) {
    if (this.handLen !== 2) {
      throw new Error(
        `attempted to convert preflop iso to ${this.handLen} cards per combo range`
      )
    }

    this.reset()

    const weights = preflop.getWeights()
    for (let i = 0; i < weights.length; i++) {
      const weight = weights[i]
      const combos = preflop.allVariants(i)
      for (const combo of combos) {
        this.set(combo, weight)
      }
    }

    return this
  }

  /** returns all combos in this range but not in `compare` */
  public asymmetry(compare: Range) {
    const rIdxs = this.map((hand) => getHandIdx(hand))
    const cIdxs = compare.map((hand) => getHandIdx(hand))
    const rSet = new Set(rIdxs)
    const cSet = new Set(cIdxs)
    const idxs = Array.from(new Set([...rIdxs, ...cIdxs]))
    return idxs.filter((c) => !rSet.has(c) || !cSet.has(c)).map(fromHandIdx)
  }
}

// based on GTO preflop preference
const orderDesc = [
  'AA',
  'KK',
  'QQ',
  'AKs',
  'JJ',
  'AKo',
  'TT',
  'AQs',
  '99',
  'AJs',
  'AQo',
  'KQs',
  '88',
  'ATs',
  'KJs',
  '77',
  'AJo',
  'KTs',
  'QJs',
  '66',
  'A9s',
  'KQo',
  'QTs',
  'JTs',
  '55',
  'A8s',
  'ATo',
  '44',
  'A5s',
  'KJo',
  '33',
  'A4s',
  'K9s',
  'A7s',
  'A6s',
  '22',
  'A3s',
  'Q9s',
  'A2s',
  'QJo',
  'T9s',
  'J9s',
  'KTo',
  'K8s',
  'QTo',
  'JTo',
  'K7s',
  'K6s',
  'K5s',
  '87s',
  '76s',
  '65s',
  '54s',
  '98s',
  'K4s',
  'Q8s',
  'T8s',
  'J8s',
  'K3s',
  'K2s',
  'A9o',
  'Q7s',
  'Q6s',
  'Q5s',
  '97s',
  'T7s',
  'Q4s',
  '86s',
  '75s',
  'J7s',
  '64s',
  '53s',
  'Q3s',
  'Q2s',
  '96s',
  'A8o',
  'J6s',
  'T6s',
  'T9o',
  '43s',
  'J5s',
  'J9o',
  'Q9o',
  'J4s',
  '85s',
  '74s',
  'J3s',
  '52s',
  'A5o',
  '63s',
  'J2s',
  'A7o',
  'Q8o',
  'T5s',
  '95s',
  'K9o',
  '42s',
  'T4s',
  '32s',
  'A4o',
  'A6o',
  'T3s',
  'A3o',
  'T2s',
  'T8o',
  '84s',
  'J8o',
  'K8o',
  'A2o',
  '98o',
  '73s',
  'K7o',
  'K6o',
  '94s',
  '93s',
  '87o',
  '76o',
  '65o',
  '54o',
  '62s',
  '97o',
  'T7o',
  'J7o',
  'Q7o',
  'Q6o',
  'Q5o',
  'K5o',
  '92s',
  '83s',
  '82s',
  '72s',
  '86o',
  '75o',
  '64o',
  '43o',
  '53o',
  '96o',
  'K4o',
  'K3o',
  'K2o',
  '42o',
  '32o',
  '85o',
  '74o',
  '63o',
  '52o',
  'J6o',
  'Q4o',
  'Q3o',
  'Q2o',
  'T6o',
  'J5o',
  'J4o',
  'J3o',
  'T5o',
  '95o',
  'J2o',
  'T4o',
  'T3o',
  'T2o',
  '94o',
  '84o',
  '93o',
  '92o',
  '62o',
  '83o',
  '82o',
  '73o',
  '72o'
]
const order = [...orderDesc].reverse()
const preIsoCount = 169

/**
 * stores as 13x13 (flattened) "K9s" type hands
 */
export class PreflopRange {
  private weights: number[]

  constructor() {
    this.reset()
  }

  public getWeights() {
    return this.weights
  }

  private set(idx: number, weight = 1) {
    this.weights[idx] = weight
  }

  private reset() {
    this.weights = new Array(169).fill(0)
  }

  private idxToString(idx: number) {
    return isoPre[idx]
  }

  private idxFromString(str: string) {
    return isoPre2idx[str]
  }

  /** generate combos in percentile range */
  public createFromPercentiles(min: number, max: number) {
    this.reset()

    if (min > max) return this // will be a empty range
    if (min < 0 || max < 0 || min > 1 || max > 1) {
      throw new Error('min/max must be 0-1')
    }

    const combos = order.slice(
      Math.floor(preIsoCount * min),
      Math.floor(preIsoCount * max)
    )

    for (const combo of combos) {
      this.set(isoPre2idx[combo], 1)
    }

    return this
  }

  allVariants(idx: number) {
    return isoPre2Combos[this.idxToString(idx)]
  }

  /** returns [0-1, 0-1] generating the closest match using min/max index of `order` */
  public ToMinMax() {
    // we treat this as basically "best time to buy and sell stock"
    const avgComboWeight =
      this.weights.reduce((a, c) => a + c, 0) /
      this.weights.filter((w) => w).length

    let mask = this.weights.map((w) =>
      w ? avgComboWeight + Number.EPSILON : -avgComboWeight
    ) // in event of tie, include combo

    let prices = mask.reduce((a, c, i) => {
      a[i] = i ? c + a[i - 1] : c
      return a
    }, new Array(mask.length))

    return maxSumSubarrayIdxs(prices).map(
      (idx) => idx / (this.weights.length - 1)
    )
  }

  toString() {
    let result = []
    for (let i = 0; i < this.weights.length; i++) {
      if (this.weights[i]) {
        result.push(this.idxToString(i))
      }
    }
    return result.join(',')
  }
}

export const isoPre: string[] = []
for (let i = 14; i >= 2; i--) {
  for (let j = 14; j >= 2; j--) {
    const type = i === j ? '' : i > j ? 's' : 'o'
    isoPre.push(RANKS[Math.max(i, j)] + RANKS[Math.min(i, j)] + type)
  }
}

export const isoPre2idx = Object.fromEntries(
  Object.keys(isoPre).map((i) => [isoPre[i], parseInt(i)])
)

const handToIsoPre = (hand: number[]) => {
  const sorted = sortCards([...hand])
  const ranks = sorted.map((c) => getRank(c))
  const suits = sorted.map((c) => getSuit(c))
  const type = ranks[0] === ranks[1] ? '' : suits[0] === suits[1] ? 's' : 'o'
  return ranks.map((r) => RANKS[r]).join('') + type
}

export const isoPre2Combos: Record<string, number[][]> = {}
for (const hand of genCardCombinations(2)) {
  const iso = handToIsoPre(hand)
  isoPre2Combos[iso] ??= []
  isoPre2Combos[iso].push(hand)
}

export const any2pre = new PreflopRange().createFromPercentiles(0, 1)
export const any2 = new Range().createFromPreflop(any2pre)
/** returns all combos in only one of provided ranges */
export const rangesAsymmetry = (r1: Range, r2: Range) => [
  ...r1.asymmetry(r2),
  ...r2.asymmetry(r1)
]

/** what percent of total combos are shared */
export const rangeOverlap = (range: Range, compare: Range) => {
  const asymm = rangesAsymmetry(range, compare)
  const dissim = asymm.length / (range.getSize() + compare.getSize())
  return 1 - dissim
}

/** O(N) - Kadane's algorithm for https://en.wikipedia.org/wiki/Maximum_subarray_problem */
const maxSumSubarrayIdxs = (prices: number[]) => {
  let buy = 0
  let bestProfit = 0
  let bestIdxs = [0, prices.length - 1]
  for (let i = 1; i < prices.length; i++) {
    const profit = prices[i] - prices[buy]

    if (profit > bestProfit) {
      bestProfit = profit
      bestIdxs = [buy, i]
    }

    if (prices[i] < prices[buy]) {
      buy = i
    }
  }

  return bestIdxs
}
