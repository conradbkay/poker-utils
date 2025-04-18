export const STRAIGHT_FLUSH = 0
export const FOUR_OF_A_KIND = 1
export const FULL_HOUSE = 2
export const FLUSH = 3
export const STRAIGHT = 4
export const THREE_OF_A_KIND = 5
export const TWO_PAIR = 6
export const ONE_PAIR = 7
export const HIGH_CARD = 8

/**
 * Provides a description of a hand rank number.
 * It's an {Array} which can be indexed into with the hand rank
 * in order to retrieve the matching description.
 *
 * Example: `rankDescription[rank.FULL_HOUSE] === 'Full House'`
 *
 * @name rankDescription
 */
export const rankDescription = [
  'Straight Flush',
  'Four of a Kind',
  'Full House',
  'Flush',
  'Straight',
  'Three of a Kind',
  'Two Pair',
  'One Pair',
  'High Card'
]

/**
 * Converts a hand strength number into a hand rank number
 * `0 - 8` for `STRAIGHT_FLUSH - HIGH_CARD`.
 *
 * @name handRank
 * @function
 * @param val hand strength (result of an `evaluate` function)
 * @return the hand rank
 */
export function handRank(val: number) {
  if (val > 6185) return HIGH_CARD // 1277 high card
  if (val > 3325) return ONE_PAIR // 2860 one pair
  if (val > 2467) return TWO_PAIR //  858 two pair
  if (val > 1609) return THREE_OF_A_KIND //  858 three-kind
  if (val > 1599) return STRAIGHT //   10 straights
  if (val > 322) return FLUSH // 1277 flushes
  if (val > 166) return FULL_HOUSE //  156 full house
  if (val > 10) return FOUR_OF_A_KIND //  156 four-kind
  return STRAIGHT_FLUSH //   10 straight-flushes
}
