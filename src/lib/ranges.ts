import { detailRange } from 'pdetail'

import prange from 'prange'

import { convertCardsToNumbers } from './eval/strength'

export type Combo = [number, number]

export type Range = Combo[]

export const rangeStrToCombos = (str: string): Range => {
  const pranged = prange(str)

  const combos = pranged
    .map((s) => Array.from(detailRange(s)))
    .join(',')
    .split(',')

  return combos.map((combo) =>
    convertCardsToNumbers([combo.substring(0, 2), combo.substring(2)])
  )
}

const ep3b = '77+, ATs+, A5s-A4s, KTs+, QTs+, JTs, 65s, AQo+'
const late3b = '66+, A7s+, A5s-A4s, K9s+, Q9s+, J9s+, T9s, 65s, 54s, AJo+, KQo'

const BvB3b =
  '88+, AJs+, A8s, A5s, KQs, K9s, K7s, QTs, J9s+, T9s, T6s, T3s-T2s, 98s, 87s, 76s, 65s, 54s, AQo+, A6o, A2o, KJo, K7o-K6o, Q8o, J8o'

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

const random = rangeStrToCombos(
  '22+,A2s+,K2s+,Q2s+,J2s+,T2s+,92s+,82s+,72s+,62s+,52s+,42s+,32s,A2o+,K2o+,Q2o+,J2o+,T2o+,92o+,82o+,72o+,62o+,52o'
)

export const ranges: {
  [key: string]: [number, number][]
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

// returns [oopRange, ipRange]
export const resolveRanges = (
  oopPos: number,
  ipPos: number,
  aggIdx: number,
  potType: number
) => {
  const pot = ['limp', 'or', '3b', '4b'][Math.min(potType, 3)]

  const aggPos = Math.min(aggIdx === 0 ? oopPos : ipPos, 5) // 6-max only
  const pfcPos = Math.min(aggIdx === 1 ? oopPos : ipPos, 5)

  if (pot === 'limp') {
    return [ranges['limp'], ranges['limp']]
  }

  if (pot === 'or' && aggIdx === 0 && aggPos !== 1) {
    return [openRanges[aggPos], ranges['ipFlat']]
  }

  if (pot === 'or') {
    return aggIdx === 0
      ? [openRanges[aggPos], bbFlatOpenRanges[pfcPos]]
      : [bbFlatOpenRanges[pfcPos], openRanges[aggPos]]
  }

  if (pot === '3b' && ipPos === -1) {
    return [ranges['hu3b'], ranges['huFlat3b']]
  }

  if (oopPos === 1 && ipPos === 2 && pot === '3b') {
    return [ranges['flatLate3b'], ranges['BvB3b']] // BvB 3bp
  }

  if (pot === '3b') {
    const openerPos = aggIdx === 0 ? ipPos : oopPos

    const lateOpen = openerPos >= 4

    const aggRange = ranges[lateOpen ? 'late3b' : 'ep3b']
    const pfcRange = ranges[lateOpen ? 'flatLate3b' : 'flatEp3b']

    return aggIdx === 0 ? [aggRange, pfcRange] : [pfcRange, aggRange]
  }

  if (pot === '4b') {
    return [ranges['late4b'], ranges['flat4b']]
  }

  return [ranges['generic'], ranges['generic']] // should never be reached
}
