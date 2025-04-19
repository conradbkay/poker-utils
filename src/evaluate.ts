import { RANKS_DATA } from '@lib/init'
import { valueFromPHE } from '@lib/phe/convert'
import { getPHEValue } from '@lib/phe/evaluate'
import { pInfo } from '@lib/twoplustwo/strength'
import { evaluate as twoplustwoEval } from '@lib/twoplustwo/evaluate'

export const evaluate = (cards: number[]) =>
  RANKS_DATA ? twoplustwoEval(cards) : pInfo(valueFromPHE(getPHEValue(cards)))
