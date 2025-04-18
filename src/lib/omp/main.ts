// index.ts
import { HandEvaluator } from './handEvaluator'
import { Hand } from './hand'
import * as C from './constants'

// Now you can use the classes
const evaluator = new HandEvaluator()

const categoryMap: { [key: number]: string } = {
  1: 'High Card',
  2: 'Pair',
  3: 'Two Pair',
  4: 'Three of a Kind',
  5: 'Straight',
  6: 'Flush',
  7: 'Full House',
  8: 'Four of a Kind',
  9: 'Straight Flush'
}

function evaluateRank(cardIndices: number[]): number {
  let hand = Hand.EMPTY
  for (const index of cardIndices) {
    hand = hand.add(Hand.fromCardIndex(index))
  }
  return evaluator.evaluate(hand)
}

function evaluate(cardIndices: number[]): {
  rank: number
  category: number
  categoryName: string
} {
  const rank = evaluateRank(cardIndices)

  const category = rank >> C.HAND_CATEGORY_SHIFT

  return { rank, category, categoryName: categoryMap[category] || 'Unknown' }
}

export { Hand, HandEvaluator, C as PokerConstants, evaluate, evaluateRank }
