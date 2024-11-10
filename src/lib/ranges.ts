import { detailRange } from 'pdetail'
import prange from 'prange'
import { boardToInts, formatCards } from './eval/utils'

// 4s3c -> 43o
export const toRangeNotation = (hand: string) => {
  const ints = boardToInts(hand).sort((a, b) => b - a)

  const formatted = formatCards(ints)

  const suited = formatted[0][1] === formatted[1][1]
  const pair = formatted[0][0] === formatted[1][0]
  const base = formatted[0][0] + formatted[1][0]
  const end = pair ? '' : suited ? 's' : 'o'

  return base + end
}

export type Combo = [number, number]

export type Range = Combo[]

export const rangeStrToCombos = (str: string): Range => {
  const pranged = prange(str)

  const combos = pranged
    .map((s) => Array.from(detailRange(s)))
    .join(',')
    .split(',')

  return combos.map((combo) =>
    boardToInts([combo.substring(0, 2), combo.substring(2)])
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

const ploStrs = [
  ['2c', '7d', 'Ac', 'Th'],
  ['2c', '7s', 'As', 'Qc'],
  ['2d', '3c', '7h', 'Ah'],
  ['2d', '2h', '3d', 'Jh'],
  ['2d', '9d', 'Kc', 'Tc'],
  ['2h', '3d', '4d', '5h'],
  ['2h', '4d', '8d', 'Ah'],
  ['2h', '2s', 'Ah', 'Qc'],
  ['2h', '7c', '9c', 'Qh'],
  ['2c', '2s', '7s', '8c'],
  ['3c', 'Ad', 'Ah', 'Kd'],
  ['3d', '3h', 'As', 'Js'],
  ['3d', '7h', '9d', '9h'],
  ['2h', '3s', '4s', 'Ad'],
  ['3s', '4s', '5d', '6s'],
  ['3s', '4d', '7c', 'Ad'],
  ['3s', '4c', '7d', 'Ac'],
  ['3s', '7h', '8h', 'Ah'],
  ['4c', '4h', '8s', 'Ac'],
  ['4d', '5c', '8c', 'Jd'],
  ['4d', '6c', '6h', 'Ad'],
  ['4d', 'Jd', 'Tc', 'Th'],
  ['4h', 'Ad', 'Jc', 'Qh'],
  ['2c', '2s', '4s', '5c'],
  ['4s', '6h', 'Ah', 'Ks'],
  ['4s', '9h', 'Ac', 'Ks'],
  ['4s', '9c', 'Qh', 'Qs'],
  ['4c', '4h', '5c', 'As'],
  ['3s', '5c', '6s', 'Kc'],
  ['5c', '7s', 'Kc', 'Ts'],
  ['3c', '3d', '5d', 'Kc'],
  ['5d', '7c', 'Ac', 'Ad'],
  ['2d', '5d', 'Kc', 'Qc'],
  ['3s', '4c', '5h', '6c'],
  ['5h', '8d', 'Kh', 'Ts'],
  ['5h', '6c', 'Ad', 'Jd'],
  ['2h', '5s', '6h', '9s'],
  ['3h', '5c', '5s', 'As'],
  ['5s', '6d', '9d', 'Ad'],
  ['5s', '6h', 'Ac', 'Jc'],
  ['5s', '9c', 'Jh', 'Js'],
  ['4h', '5s', 'Ad', 'Ks'],
  ['5d', '5s', 'Qd', 'Qs'],
  ['5s', '9c', 'Jh', 'Tc'],
  ['6c', '7d', '7s', 'Ad'],
  ['3s', '6c', '8s', 'Jc'],
  ['5d', '6c', '9c', 'Kc'],
  ['6c', 'Jd', 'Js', 'Tc'],
  ['4c', '6c', '6d', '7s'],
  ['5d', '5h', '6d', '9s'],
  ['5h', '6d', '9d', '9h'],
  ['6d', '7h', '8d', 'Kh'],
  ['5c', '6c', '6d', '9h'],
  ['4c', '6d', 'Kd', 'Ks'],
  ['6d', '7h', 'Ac', 'Qh'],
  ['6d', '6s', '9s', 'Th'],
  ['4s', '6h', 'As', 'Ks'],
  ['6h', '8c', 'As', 'Qh'],
  ['2c', '6h', 'As', 'Jd'],
  ['4s', '6h', 'As', 'Qc'],
  ['2d', '4s', '6s', 'Jd'],
  ['2c', '4c', '4d', '6s'],
  ['5c', '6s', '7d', '7s'],
  ['5d', '6s', '8s', '9c'],
  ['6s', 'Ac', 'Ad', 'As'],
  ['6s', '8h', 'Jc', 'Qd'],
  ['3c', '6h', '7c', 'Th'],
  ['4d', '5c', '5s', '7d'],
  ['2c', '5h', '7d', 'Kh'],
  ['3c', '3s', '7c', '7d'],
  ['3s', '7d', '8d', 'Ac'],
  ['4c', '5s', '7d', '9c'],
  ['7d', 'Jc', 'Jd', 'Kc'],
  ['7d', '8s', 'Kc', 'Qc'],
  ['2h', '5h', '7h', 'Ah'],
  ['6d', '6h', '7h', 'Ah'],
  ['6d', '7h', '8c', 'Tc'],
  ['7h', '8d', '9h', 'Tc'],
  ['7c', '7s', 'Ac', 'Kc'],
  ['4d', '8c', '8h', '9s'],
  ['5c', '6c', '8c', 'Ac'],
  ['2h', '8c', 'Kd', 'Qd'],
  ['8c', 'Ad', 'Jd', 'Ts'],
  ['2d', '8d', 'Ah', 'Kd'],
  ['5s', '6s', '7s', '8d'],
  ['3h', '6c', '8d', 'Ad'],
  ['6d', '8d', '8h', 'Qh'],
  ['5h', '6d', '8d', 'Ah'],
  ['8d', 'Ah', 'Jd', 'Th'],
  ['2h', '7c', '8d', 'Kh'],
  ['7d', '7s', '8d', 'Th'],
  ['3d', '3s', '8h', '9h'],
  ['3d', '8h', '9h', 'Ah'],
  ['2h', '6d', '8h', 'Kh'],
  ['7d', '8h', '9d', '9s'],
  ['4s', '8h', 'Kc', 'Qc'],
  ['3d', '4d', '8s', 'Qs'],
  ['3h', '8c', '8s', 'Ah'],
  ['8c', '8s', 'Jh', 'Kd'],
  ['6d', '8s', 'Qc', 'Qd'],
  ['2s', '4s', '7c', '9c'],
  ['4d', '7h', '9c', 'Kh'],
  ['8d', '9c', 'Ad', 'Qs'],
  ['7h', '9c', 'Js', 'Ks'],
  ['7h', '9c', 'Tc', 'Td'],
  ['9c', 'Qd', 'Tc', 'Th'],
  ['2d', '7h', '9d', 'Ac'],
  ['3s', '4h', '9d', '9h'],
  ['3s', '7h', '9d', 'Kh'],
  ['8d', '9d', 'Ad', 'Kh'],
  ['8s', '9d', 'Td', 'Th'],
  ['8h', '9d', 'Js', 'Kd'],
  ['2d', '6s', '9d', 'Ts'],
  ['4s', '9c', '9h', 'Jc'],
  ['3h', '9h', 'Jh', 'Kd'],
  ['7h', '9h', 'Kd', 'Tc'],
  ['2c', '9h', 'Ks', 'Qs'],
  ['9d', '9h', 'Jd', 'Qh'],
  ['2s', '6c', '7c', '9s'],
  ['4d', '5d', '9s', 'Ac'],
  ['9h', '9s', 'Jc', 'Jh'],
  ['2c', '9s', 'Kc', 'Kh'],
  ['4s', '9s', 'Jh', 'Ts'],
  ['2h', '4c', '7c', 'Ac'],
  ['5h', '6d', '8s', 'Ac'],
  ['2h', '8c', 'Ac', 'Jh'],
  ['4d', '5c', 'Ac', 'Kc'],
  ['5d', 'Ac', 'Kd', 'Qc'],
  ['Ac', 'Ad', 'Kd', 'Ts'],
  ['4s', '5d', 'Ac', 'Ks'],
  ['4d', '4h', 'Ac', 'Th'],
  ['Ac', 'Ks', 'Qs', 'Th'],
  ['4s', '9h', 'Ad', 'Qs'],
  ['3h', '5s', 'Ac', 'Ad'],
  ['5c', '6h', 'Ad', 'As'],
  ['2h', '3c', 'Ad', 'Qd'],
  ['2s', '5c', 'Ah', 'Th'],
  ['6c', '7h', 'Ah', 'Th'],
  ['7h', 'Ad', 'Ah', 'Kd'],
  ['5c', 'Ah', 'As', 'Tc'],
  ['3c', 'Ah', 'Jh', 'Td'],
  ['4h', '6s', '8d', 'As'],
  ['4c', '9s', 'As', 'Th'],
  ['Ad', 'Ah', 'As', 'Kc'],
  ['4h', 'As', 'Kh', 'Qd'],
  ['3d', '9s', 'As', 'Qh'],
  ['3h', '4h', 'Jc', 'Tc'],
  ['5s', '7h', 'Ah', 'Jc'],
  ['6c', 'Jc', 'Kc', 'Qd'],
  ['9d', 'Ac', 'Jd', 'Qs'],
  ['As', 'Jd', 'Kc', 'Tc'],
  ['3d', 'Jc', 'Jd', 'Ks'],
  ['6s', 'Jc', 'Jd', 'Tc'],
  ['Ad', 'Jd', 'Qh', 'Tc'],
  ['8s', 'As', 'Jd', 'Tc'],
  ['Ad', 'Ah', 'Jd', 'Td'],
  ['4h', '8h', '8s', 'Jh'],
  ['8d', '8h', 'Jh', 'Ts'],
  ['4c', '6s', 'Jh', 'Js'],
  ['8s', 'As', 'Jh', 'Td'],
  ['8h', '9h', 'Js', 'Kd'],
  ['7c', 'Ad', 'Js', 'Qs'],
  ['6c', 'Jc', 'Js', 'Qh'],
  ['6c', 'Jd', 'Js', 'Qs'],
  ['4c', 'Kc', 'Qc', 'Qs'],
  ['7s', '8s', 'Kc', 'Qs'],
  ['9h', 'Kc', 'Kd', 'Qd'],
  ['9s', 'Ac', 'Ah', 'Kc'],
  ['Jh', 'Kc', 'Qc', 'Tc'],
  ['5h', '8s', 'Kd', 'Td'],
  ['7s', 'Kc', 'Kd', 'Qs'],
  ['5d', '5h', '9d', 'Kh'],
  ['6d', 'Ah', 'Kh', 'Ks'],
  ['3s', '7s', 'As', 'Kh'],
  ['8d', '9s', 'Kh', 'Qh'],
  ['Ad', 'Ah', 'Kh', 'Th'],
  ['4c', '9c', 'Kh', 'Ts'],
  ['2c', 'Kh', 'Ks', 'Td'],
  ['3h', '6h', '9s', 'Ks'],
  ['4c', '5d', 'Kd', 'Ks'],
  ['9h', 'Ah', 'Jd', 'Ks'],
  ['9s', 'Ad', 'Js', 'Ks'],
  ['5d', 'Jc', 'Js', 'Qc'],
  ['9s', 'Jh', 'Kc', 'Qc'],
  ['7h', '9c', 'Kd', 'Qc'],
  ['2c', '9c', 'Qc', 'Qh'],
  ['3c', '3h', '6d', 'Qd'],
  ['3s', 'Ac', 'Ad', 'Qd'],
  ['6s', '7d', 'Ks', 'Qd'],
  ['3h', '9h', 'Qd', 'Th'],
  ['3h', '8s', 'Qd', 'Qs'],
  ['2h', 'Jc', 'Qh', 'Qs'],
  ['4s', '9d', 'Qc', 'Qh'],
  ['5c', 'As', 'Jc', 'Qh'],
  ['3c', '6c', 'Qc', 'Qh'],
  ['5d', '9s', 'Qd', 'Qh'],
  ['2s', 'Jd', 'Qs', 'Td'],
  ['2s', '7s', 'Qh', 'Qs'],
  ['As', 'Jd', 'Jh', 'Qs'],
  ['6d', '6h', 'Kd', 'Qs'],
  ['2c', '7h', 'Qd', 'Qs'],
  ['8d', '9d', 'Jh', 'Tc'],
  ['5s', '7c', '8s', 'Tc'],
  ['2c', 'As', 'Kh', 'Td'],
  ['4d', '7c', '7h', 'Td'],
  ['Jc', 'Jd', 'Qc', 'Td'],
  ['Kd', 'Qc', 'Tc', 'Td'],
  ['5c', '6c', '9h', 'Th'],
  ['3s', 'Jh', 'Td', 'Th'],
  ['8s', '9h', 'Qh', 'Th'],
  ['7d', '7s', 'Th', 'Ts'],
  ['3h', '8c', 'Ah', 'Ts'],
  ['5s', 'Jh', 'Js', 'Ts'],
  ['6s', 'Ad', 'Jd', 'Ts'],
  ['4s', '7h', 'Ah', 'Ts'],
  ['6h', 'Ks', 'Th', 'Ts']
]

export const plo5Strs: string[][] = [
  'KhQdJsTd4d',
  'AsKhJh7h3s',
  'Ad9h7s7d5h',
  'AdQcTh8c4s',
  'JsTd9d8h3h',
  'AsAh9h7h4s',
  'AdJsJh8c2c',
  'AhKdQd3s3d',
  'JdTh8d7h6s',
  'QhQdJs9c4c',
  'QdJdTh7s7d',
  'AsTh9s6h5h',
  'KdQcJh9c3s',
  'AdTh9s7c3c',
  'AdQd8s6h2h',
  'QsQd7h6d4h',
  'AsTh9h3s3h',
  'AcJc8d6h5s',
  'KsTh9s8h7h',
  'JdTd8h5h4s',
  'AdKhQcTc3s',
  'AhTd9d6s5d',
  'AhQdJsJd5d',
  'KdTh9d8h5s',
  'KdJh6s5d3h',
  'AsJdTh6h2d',
  'AhAdAcKdKc',
  'Kd8h6s6h5d',
  'KhQsJhTs7h',
  'JhJd5s5d3h',
  'AhAd9h9d7s',
  'KhQhJs5h4s',
  'AhTs7s4h3h',
  'AcKdJcTh9s',
  'KdQdJh4h3s',
  'AhAdAc9c6s',
  'AhAdTs9d2d',
  'Tc9d8s8h6c',
  'JdJc9c8s8h',
  'KhKd8s6c5c',
  'QdJsTh6h6d',
  'AsKsTh9h2h',
  'AdKhJc9c2s',
  'AsAh6h2s2h',
  '9s8h8d7d5h',
  'Ad7h9d7d3s',
  'KsQsJsTs2s',
  'AdQdTh8d2s',
  'AdKhTs9d4d',
  'KhKdJd8s3h',
  'KdJhTd9d5s',
  'AsKs9h6h3h',
  'QhQd5s5d4h',
  'KsTh6s6h5h',
  'AdKdTh5s2d',
  'AdQh4s4d2h',
  'AdKh3s3h2d',
  'As8h7s7h3h',
  'AdQcJh9c7h',
  'AdKh8d6s4d',
  'KsQh8s8h7h',
  'KdJd8h6s5h',
  'AsAhJs7h4h',
  'QsQh9h8h6h',
  'AcKc7d4s4h',
  'AcKhKdKc4s',
  'AhQsQhJs9h',
  'QdJdTs9h8h',
  'JdTh9s6c5c',
  'AdKh8d4h3s',
  'AdJsJh6h3d',
  'AdAcKh4c3s',
  'AdJd9s5h2h',
  'Ad8h6s4h2d',
  'AcJdTc5h3s',
  'AcQdQc8h2s',
  'JhTs7s6h4h',
  'AsAhKhJh8h',
  'AsTs8s7s5s',
  'AdKhKc8s8c',
  'AsQh9s7h6h',
  'AdAcJh9s9c',
  'AcKdJhJc5s',
  'KdQsJd8h7h',
  'Ad9h5d3s3h',
  'AsJd9d7h2h',
  'AdJhTs6d3h',
  'AhAd9d8d7s',
  'JhTh8h6s4s',
  'Ad8h8d6h4s',
  'AsJh9s7h5h',
  'AdTc9h7c6s',
  'AhKs8h6s5h',
  'AsQhTh4s4h',
  'AdKsKh3d2h',
  'AhQd9d8s6d',
  'AsAhKh7s4h',
  'AhKhJs7h2h',
  'AsTd9d8h7h',
  'AdKd8s8h5d',
  'KdQhQdTs5d',
  'QdJsJh9h5d',
  'AdQhTs5d4d',
  'QhQdJs9d2h',
  'Ad8d7h6s4d',
  'AhKdQd5s2d',
  'AdQhTh9s2d',
  'AdQhJh8s6d',
  'AcJd5c4s4h',
  'AcKcJhJd3s',
  'QdJsTh9h7d',
  'AdKsKh7d4h',
  'AcQdJhTc5s',
  'KdTh9d8s7h',
  'AdQhJs6d3h',
  'AhQh9h6s5h',
  'AhJhTs4h3h',
  'AsAhJh8s8h',
  'KdKcQcTh5s',
  'AhTh9s5s4h',
  'AhQsQh9h4s',
  'AhQsQh9h4s',
  'AhTh6s4s4h',
  'KsJdThTd3h',
  'AdAcJh8s7c',
  'KsKhQsJh6h',
  'AhKhQh6s2s',
  'QdTsTh9d8d',
  'AdQh7d6s3h',
  '8d8h6d5h4s',
  'AdKhQsJd5d',
  'QhQdTc7c6s',
  'AhQsJs6h2h',
  'As7h5h4h3s',
  'KhJhTh9s3h',
  'KhJhTh9s2s',
  'AdTh9d6s3d',
  'AsAdKhJh6d',
  'KsJhTh9h2s',
  'AdKs9h3h3d',
  '8h6s6h5h4s',
  '9s9h8s7h5h',
  'AhKhQsJsTh',
  'KdQhQdTs8d',
  'KhQsQhTh3h',
  'QdJh9s9d6h',
  'AcTd7h4s3c',
  'AhKd8s6d5d',
  'AdTs7h7d6h',
  'AdKcTh7s6c',
  'AdKs9h6h2d',
  'AdQhQc7s5c',
  'AdQdJsJh6d',
  'AdTh9s4d2h',
  'AsAhAd6d4d',
  'KhKdJcTc8s'
].map((s) => s.match(/.{1,2}/g))

export const ploRange = ploStrs.map((s) => boardToInts(s.join(' ')))
