import { detailRange } from 'pdetail'
import prange from 'prange'
import { boardToInts, getRank, getSuit } from '../cards/utils'
import { sortCards } from '../sort'
import { fromHandIdx, getHandIdx } from '../utils'
import { c2fstr, DECK } from '../twoplustwo/constants'
import { makeCard } from '../iso'

/**
 * migrate this code to use our isomorphism functions
 * for 2 cards easy s/o/empty if pair
 * omaha too many combos so just monte carlo
 */

/** -> 43o */
export const toRangeNotation = (hand: number[]) => {
  const ranks = hand.map(getRank)
  const suits = hand.map(getSuit)

  const suited = new Set(suits).size < hand.length
  const pair = new Set(ranks).size < hand.length
  const base = hand.map((c) => c2fstr[c][0]).join('')
  const end = pair ? '' : suited ? 's' : 'o'

  return base + end
}

// also removes duplicates
export const sortRange = (range: Range) => {
  const sortedCombos = range.map(sortCards)
  const idxs = sortedCombos.map(getHandIdx).sort((a, b) => a - b)
  const deduped = sortedCombos.filter((cs, i) => !i || idxs[i] !== idxs[i - 1])
  return deduped.sort((a, b) => getHandIdx(b) - getHandIdx(a))
}

// 43o -> 12 combos
export const fromRangeNotation = (hand: string) => {
  const type = hand[hand.length - 1]
  const baseRanks = sortCards(
    hand
      .slice(0, 2)
      .split('')
      .map((r) => DECK[r.toLowerCase() + 's'])
  ).map((c) => getRank(c))

  let inner = type === 's' ? 0 : 3

  let result = []
  for (let i = 0; i <= 3; i++) {
    let c1 = makeCard(baseRanks[0], i)
    let extra = 0
    while (extra <= inner) {
      const c2Suit = (i + extra) % 4
      extra++

      if (c2Suit === i && type !== 's') {
        continue
      }

      if (baseRanks[0] === baseRanks[1] && c2Suit > i) {
        continue // would be a duplicate
      }

      result.push([c1, makeCard(baseRanks[1], c2Suit)])
    }
  }

  return sortRange(result)
}

export type Combo = number[]

export type Range = Combo[]

export const rangeStrToCombos = (str: string): Range => {
  const pranged = prange(str)

  const combos = pranged
    .map((s) => Array.from(detailRange(s)))
    .join(',')
    .split(',')

  return combos.map((combo) =>
    sortCards(boardToInts([combo.substring(0, 2), combo.substring(2)]))
  )
}

// manual polar range
const BvB3b =
  '88+, AJs+, A8s, A5s, KQs, K9s, K7s, QTs, J9s+, T9s, T6s, T3s-T2s, 98s, 87s, 76s, 65s, 54s, AQo+, A6o, A2o, KJo, K7o-K6o, Q8o, J8o'

const ep3b = '77+, ATs+, A5s-A4s, KTs+, QTs+, JTs, 65s, AQo+'
const late3b = '66+, A7s+, A5s-A4s, K9s+, Q9s+, J9s+, T9s, 65s, 54s, AJo+, KQo'

const flatEp3b = 'TT-88, 66, 44, 22, AQs+, ATs, A5s, KTs+, QJs, 87s, 65s'
const flatLate3b =
  '99-22, AQs-AJs, A9s, A5s-A4s, KQs, KTs-K9s, QTs+, J9s+, T8s+, 87s, 65s'

const late4b = 'JJ+, AQs+, A8s, Q9s, J9s, T8s, AKo, AJo'
const ep4b = 'JJ+, AQs+, ATs, A5s, KJs'
const flat4b = 'TT-77,AQs-ATs,A5s,KTs+,T9s,AA'

const limp =
  '77-22, A9s-A2s, K9s-K2s, QTs-Q2s, J4s+, T5s+, 95s+, 85s+, 75s+, 65s, 54s, 43s, ATo-A2o, KJo-K7o, Q8o+, J9o+, T9o, 98o'

const ipFlat = '88-55, AQs-ATs, A7s, A5s, KTs+, QTs+, JTs, T9s, 98s'

const generic = '22+, A2s+, K5s+, Q8s+, J9s+, T9s, 76s, 65s, 54s, ATo+, KQo'

const hu3b =
  '77+, AKs-A7s, A5s-A3s, AKo-ATo, KJo, KQo, KQs-K9s, QJs-Q6s, JTs-J7s, T9s-T7s, 98s, 97s, 87s, 86s, 85s, 76s, 65s, 54s, 74s, K7o, Q8, T9o, A5o, K6s'
const huFlat3b =
  'AJs-A2s, KQs-K2s, QJs-Q3s, JTs-J5s, 88-22, T9s-T7s, 98s-96s, 86s, 85s, 76s-74s, 65s-63s, 54s, 53s, 43s, A9o, ATo, AJo, KQo, KJo, KTo, QJo, QTo, JTo, T9o'

const rangesStrs = {
  ep3b,
  late3b,
  BvB3b,
  flatEp3b,
  flatLate3b,
  late4b,
  ep4b,
  flat4b,
  limp,
  ipFlat,
  generic,
  hu3b,
  huFlat3b
}

// based on GTO preflop preference
// todo generate exponentially diminished weights
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

const random = rangeStrToCombos(order.join(','))

const preIsoCount = order.length
/** generate combos in percentile range */
export const genRange = (min: number, max: number) => {
  if (min > max) return []
  if (min > 1) min /= 100
  if (max > 1) max /= 100

  return order
    .slice(Math.floor(preIsoCount * min), Math.floor(preIsoCount * max))
    .map(fromRangeNotation)
    .flat()
}

/** returns all combos in `range` but not in `compare` */
export const rangeAsymmetry = (range: Range, compare: Range) => {
  const rIdxs = range.map(getHandIdx)
  const cIdxs = compare.map(getHandIdx)
  const rSet = new Set(rIdxs)
  const cSet = new Set(cIdxs)
  const idxs = Array.from(new Set([...rIdxs, ...cIdxs]))
  return idxs.filter((c) => !rSet.has(c) || !cSet.has(c)).map(fromHandIdx)
}

/** returns all combos in only one of provided ranges */
export const rangesAsymmetry = (r1: Range, r2: Range) => [
  ...rangeAsymmetry(r1, r2),
  ...rangeAsymmetry(r2, r1)
]

/** what percent of total combos are shared */
export const rangeOverlap = (range: Range, compare: Range) => {
  const asymm = rangesAsymmetry(range, compare)
  const dissim = asymm.length / (range.length + compare.length)
  return 1 - dissim
}

const buySellStock = (prices: number[]) => {
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

/** generates the closest match using min/max index of `order`. Max is inclusive */
const rangeToMinMax = (range: Range) => {
  let iso = new Set(Array.from(new Set(range.map(toRangeNotation))))

  let mask = order.map((s) => (iso.has(s) ? 1.01 : -1)) // go a bit wider to capture more of range
  let prices = mask.reduce((a, c, i) => {
    a[i] = i ? c + a[i - 1] : c
    return a
  }, new Array(mask.length))

  return buySellStock(prices).map((idx) => idx / (order.length - 1))
}

export const ranges: {
  [key: string]: Range
} = {
  a2c: random,
  atc: random,
  random: random
}

for (const key in rangesStrs) {
  ranges[key] = rangeStrToCombos(rangesStrs[key])
}

export const openRanges: { [key: string]: Combo[] } = {
  '-2': rangeStrToCombos(
    '22+,A2s+,K2s+,Q2s+,J2s+,T2s+,92s+,82s+,72s+,62s+,52s+,42s+,32s,A2o+,K2o+,Q3o+,J4o+,T5o+,95o+,85o+,75o+,64o+,54o'
  ),
  '-1': rangeStrToCombos(
    '22+, A2s+, K3s+, Q5s+, J7s+, T7s+, 97s+, 87s, 76s, 65s, 54s, A8o+, A5o, KTo+, QTo+, JTo'
  ), // todo HU iso
  0: rangeStrToCombos(
    '22+, A2s+, K2s+, Q2s+, J4s+, T6s+, 96s+, 85s+, 75s+, 64s+, 54s, A4o+, K8o+, Q9o+, J9o+, T9o, 98o'
  ),
  1: rangeStrToCombos(
    '22+, A2s+, K2s+, Q2s+, J4s+, T6s+, 96s+, 85s+, 74s+, 64s+, 53s+, A4o+, K8o+, Q9o+, J9o+, T9o, 98o'
  ),
  2: rangeStrToCombos(
    '22+, A2s+, K3s+, Q5s+, J7s+, T7s+, 97s+, 87s, 76s, 65s, 54s, A8o+, A5o, KTo+, QTo+, JTo'
  ), // always iso
  5: rangeStrToCombos('55+,A3s+,K7s+,K5s,Q9s+,J9s+,T9s,76s,54s,ATo+,KQo,QJo'),
  4: rangeStrToCombos(
    '33+, A2s+, K5s+, Q7s+, J8s+, T8s+, 97s+, 87s, 76s, 65s, 54s, A9o+, KTo+, QJo'
  ),
  3: rangeStrToCombos(
    '22+, A2s+, K3s+, Q5s+, J7s+, T7s+, 97s+, 87s, 76s, 65s, 54s, A8o+, A5o, KTo+, QTo+, JTo'
  ),
  // TODO fullring
  6: rangeStrToCombos('55+,A3s+,K7s+,K5s,Q9s+,J9s+,T9s,76s,54s,ATo+,KQo,QJo'),
  7: rangeStrToCombos('55+,A3s+,K7s+,K5s,Q9s+,J9s+,T9s,76s,54s,ATo+,KQo,QJo'),
  8: rangeStrToCombos('55+,A3s+,K7s+,K5s,Q9s+,J9s+,T9s,76s,54s,ATo+,KQo,QJo')
}

export const bbFlatOpenRanges = {
  1: rangeStrToCombos(
    '99-22,ATs-A6s,A3s-A2s,KTs,K8s-K7s,K5s-K2s,QTs-Q2s,J9s-J2s,T8s-T5s,T3s,97s-94s,86s-84s,75s-73s,63s+,53s-52s,42s+,32s,AJo-A7o,A5o-A3o,K8o+,K6o,QTo+,Q8o,J9o+,T8o+,98o,87o,76o'
  ), // bvb
  2: rangeStrToCombos(
    '99-22,ATs-A6s,A3s-A2s,KTs,K8s-K7s,K5s-K2s,QTs-Q2s,J9s-J2s,T8s-T5s,T3s,97s-94s,86s-84s,75s-73s,63s+,53s-52s,42s+,32s,AJo-A7o,A5o-A3o,K8o+,K6o,QTo+,Q8o,J9o+,T8o+,98o,87o,76o'
  ),
  5: rangeStrToCombos(
    'JJ-22,AJs-A6s,A4s-A3s,K5s+,K3s-K2s,QTs-Q5s,J9s-J7s,T7s+,96s+,86s-85s,74s+,63s+,53s-52s,43s,32s,AQo-ATo,KTo+,QJo,JTo'
  ),
  4: rangeStrToCombos(
    'TT-22,AJs-A6s,A4s-A3s,KTs-K5s,K3s-K2s,Q9s-Q4s,J9s-J7s,T7s+,95s+,86s-85s,75s-74s,63s+,53s-52s,42s+,32s,AQo-A9o,A5o,KTo+,QTo+,JTo'
  ),
  3: rangeStrToCombos(
    '99-22,AJs-A6s,A4s-A2s,KQs,K9s-K5s,K3s-K2s,Q9s-Q6s,Q4s-Q2s,J8s,J6s-J4s,T8s-T6s,95s+,86s-85s,75s-74s,63s+,53s-52s,42s+,32s,AQo,ATo-A8o,A5o,KJo-KTo,QTo+,JTo,T9o'
  ),
  0: rangeStrToCombos(
    '88-22,A9s-A6s,A3s-A2s,K9s-K7s,K5s-K2s,Q4s+,Q2s,J8s-J6s,J4s-J2s,T7s,T5s,95s+,86s-85s,74s+,64s-63s,52s+,42s+,AJo,A9o-A8o,A5o-A4o,KQo,KTo-K9o,Q9o+,J9o+,T9o,98o'
  ),
  '-2': rangeStrToCombos(
    '55-22,A7s-A6s,A2s,K8s,K4s-K2s,Q8s,Q5s-Q2s,J6s-J2s,T5s-T2s,95s-92s,84s-83s,74s-73s,64s-63s,53s-52s,42s+,32s,A9o-A8o,A6o-A2o,KJo-K9o,K7o-K5o,QTo+,Q8o-Q6o,J9o-J7o,T7o+,97o+,86o+,76o,65o'
  ),
  '-1': rangeStrToCombos(
    '99-22,ATs-A6s,A3s-A2s,KTs,K8s-K7s,K5s-K2s,QTs-Q2s,J9s-J2s,T8s-T5s,T3s,97s-94s,86s-84s,75s-73s,63s+,53s-52s,42s+,32s,AJo-A7o,A5o-A3o,K8o+,K6o,QTo+,Q8o,J9o+,T8o+,98o,87o,76o'
  ) // (HU limp call), copied from BvB for now
}
