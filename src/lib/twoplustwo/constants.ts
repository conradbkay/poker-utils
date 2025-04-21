// twoplustwo algorithm based

export const HAND_TYPES = [
  'invalid hand',
  'High Card',
  'One Pair',
  'Two Pair',
  'Three of a Kind',
  'Straight',
  'Flush',
  'Full House',
  'Four of a Kind',
  'Straight Flush'
] as const

export type HandName = (typeof HAND_TYPES)[number]

export interface EvaluatedHand {
  handType: number // Index of HANDTYPES array
  handRank: number
  p: number
  value: number
  handName: HandName
}
