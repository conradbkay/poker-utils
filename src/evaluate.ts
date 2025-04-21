import { RANKS_DATA } from './lib/init.js'
import { addGaps, valueFromPHE } from './lib/phe/convert.js'
import { getPHEValue } from './lib/phe/evaluate.js'
import { pInfo } from './lib/twoplustwo/strength.js'
import { evaluate as twoplustwoEval } from './lib/twoplustwo/evaluate.js'

export const evaluate = (cards: number[]) =>
  RANKS_DATA
    ? twoplustwoEval(cards)
    : pInfo(addGaps(valueFromPHE(getPHEValue(cards))))
