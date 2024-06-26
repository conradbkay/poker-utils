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
