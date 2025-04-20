import { EvaluatedHand } from './constants.js'
import { pInfo, fastEvalPartial } from './strength.js'

export const evaluate = (cardValues: number[]): EvaluatedHand => {
  return pInfo(fastEvalPartial(cardValues))
}
