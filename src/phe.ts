import { valueFromPHE } from '@lib/phe/convert'
import { getPHEValue } from '@lib/phe/evaluate'
import { pInfo } from '@lib/twoplustwo/strength'

export const fastEvalPartial = (cards: number[]) =>
  valueFromPHE(getPHEValue(cards))
export const evaluate = (cards: number[]) => pInfo(fastEvalPartial(cards))
