import { EvaluatedHand } from './constants'
import { pInfo, fastEvalPartial } from './strength'

export const evaluate = (cardValues: number[]): EvaluatedHand => {
  return pInfo(fastEvalPartial(cardValues))
}
