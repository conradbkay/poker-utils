import { getRank, getSuit } from '../cards/utils'
import { sortCards } from '../sort'
import { RANKS } from '../constants'
import { genCardCombinations } from '../utils'
// import { PokerRange } from './range'

const NUM_COMBOS = 169

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

// "isoPre" means AKo, 43s type representation

const isoPre: string[] = []
for (let i = 12; i >= 0; i--) {
  for (let j = 12; j >= 0; j--) {
    const type = i === j ? '' : i > j ? 's' : 'o'
    isoPre.push(RANKS[Math.max(i, j)] + RANKS[Math.min(i, j)] + type)
  }
}

const isoPre2idx = Object.fromEntries(
  Object.keys(isoPre).map((i) => [isoPre[i], parseInt(i)])
)

export const handToIsoPre = (hand: number[]) => {
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

/**
 * stores as 13x13 (flattened) "K9s" type hands
 *
 * this class isn't designed to be fast, usually it's converted to a `PokerRange` if doing anything computationally intensive
 */
export class PreflopRange {
  private weights: number[]

  constructor() {
    this.reset()
  }

  public getWeights() {
    return this.weights
  }

  public getWeight(hand: string) {
    return this.getWeights()[PreflopRange.toIdx(hand)]
  }

  public set(hand: string | number, weight = 1) {
    this.weights[this.parseHand(hand)] = weight
  }

  private reset() {
    this.weights = new Array(169).fill(0)
  }

  public static toIdx(str: string) {
    return isoPre2idx[str]
  }

  public static fromIdx(idx: number) {
    return isoPre[idx]
  }

  public static handCombos(hand: string) {
    return isoPre2Combos[hand]
  }

  private parseHand(hand: string | number) {
    if (typeof hand === 'string') {
      // if 27o convert to 72o
      if (RANKS.indexOf(hand[0]) < RANKS.indexOf(hand[1])) {
        hand = hand[1] + hand[0] + hand.slice(2)
      }

      hand = PreflopRange.toIdx(hand)
    }

    if (typeof hand !== 'number') {
      throw new Error(`hand ${hand} is not a valid `)
    }

    if (hand < 0 || hand > 168) {
      throw new Error(`hand ${hand} out of range (0-168)`)
    }

    return hand
  }

  /** generate combos in percentile range */
  public static fromPercentiles(min: number, max: number) {
    const result = new PreflopRange()

    if (min > max) return result // will be a empty range
    if (min < 0 || max < 0 || min > 1 || max > 1) {
      throw new Error(`min: ${min} and max: ${max} must be 0-1`)
    }

    const hands = order.slice(
      Math.floor(NUM_COMBOS * min),
      Math.floor(NUM_COMBOS * max)
    )

    for (const hand of hands) {
      result.set(hand, 1)
    }

    return result
  }

  /** must be within this format: "AKs,44:0.75, 32o:.33" */
  public static fromStr(str: string) {
    const range = new PreflopRange()

    str.replaceAll(' ', '')
    const combos = str.split(',')
    for (let combo of combos) {
      const [hand, weightStr] = combo.split(':')
      const weight = weightStr ? parseFloat(weightStr) : undefined
      range.set(hand, weight)
    }

    return range
  }

  // ! once PokerRange stores board state this should take that into account wrt weighting (many combos will be blocked things won't add up to 4/6/12)
  // public static fromPokerRange(range: PokerRange) {}

  /** returns [0-1, 0-1] generating the closest match using min/max index of `order` */
  public toPercentiles() {
    // we treat this as basically "best time to buy and sell stock"
    const avgComboWeight =
      this.weights.reduce((a, c) => a + c, 0) /
      this.weights.filter((w) => w).length

    let mask = this.weights.map((w) => (w ? avgComboWeight : -avgComboWeight))

    let prices = mask.reduce((a, c, i) => {
      a[i] = i ? c + a[i - 1] : c
      return a
    }, new Array(mask.length))

    return maxSumSubarrayIdxs(prices).map(
      (idx) => idx / (this.weights.length - 1)
    )
  }

  /** piosolver compatible "AA,KK,QQ,JJ:0.9,88:0.825" format */
  toString() {
    let result = []
    for (let i = 0; i < this.weights.length; i++) {
      if (this.weights[i]) {
        const iso = PreflopRange.fromIdx(i)
        result.push(
          `${iso}${this.weights[i] === 1 ? '' : ':' + this.weights[i]}`
        )
      }
    }
    return result.join(',')
  }
}

export const any2pre = PreflopRange.fromPercentiles(0, 1)
