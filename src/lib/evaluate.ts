import { RANKS_DATA } from './init.js'
import { addGaps, valueFromPHE } from './phe/convert.js'
import { getPHEValue } from './phe/evaluate.js'
import { pInfo } from './twoplustwo/strength.js'
import { evaluate as twoplustwoEval } from './twoplustwo/evaluate.js'

export const evaluate = (cards: number[]) =>
  RANKS_DATA
    ? twoplustwoEval(cards)
    : pInfo(addGaps(valueFromPHE(getPHEValue(cards))))
