// twoplustwo algorithm based

export const HAND_TYPES = [
  'invalid hand',
  'high card',
  'one pair',
  'two pairs',
  'three of a kind',
  'straight',
  'flush',
  'full house',
  'four of a kind',
  'straight flush'
] as const

export type HandName = (typeof HAND_TYPES)[number]

export interface EvaluatedHand {
  handType: number // Index of HANDTYPES array
  handRank: number
  p: number
  value: number
  handName: HandName
}
