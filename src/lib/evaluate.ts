import { RANKS_DATA } from './init.js'
import { addGaps, cardsToPHE, valueFromPHE } from './phe/convert.js'
import { getPHEValue } from './phe/evaluate.js'
import { pInfo } from './twoplustwo/strength.js'
import { evaluate as twoplustwoEval } from './twoplustwo/evaluate.js'

/** exact same input/output as twoplustwo algorithm */
export const phe = (cards: number[]) => {
  return addGaps(valueFromPHE(getPHEValue(cardsToPHE(cards))))
}

export const evaluate = (cards: number[]) =>
  RANKS_DATA ? twoplustwoEval(cards) : pInfo(phe(cards))
