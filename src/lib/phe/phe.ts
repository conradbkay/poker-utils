import {
  handRank,
  STRAIGHT_FLUSH,
  FOUR_OF_A_KIND,
  FULL_HOUSE,
  FLUSH,
  STRAIGHT,
  THREE_OF_A_KIND,
  TWO_PAIR,
  ONE_PAIR,
  HIGH_CARD
} from './hand-rank'
import { cardCodes, stringifyCardCode } from './hand-code'
import { phe } from './evaluate'

/**
 * Evaluates the 5 - 7 cards to arrive at a number representing the hand
 * strength, smaller is better.
 *
 * @name evaluateCards
 * @function
 * @param {Array.<String>} cards the cards, i.e. `[ 'Ah', 'Ks', 'Td', '3c', 'Ad' ]`
 * @return {Number} the strength of the hand comprised by the cards
 */
export function evaluateCards(cards) {
  const codes = cardCodes(cards)
  return phe(codes)
}

/**
 * Evaluates the given board of 5 to 7 cards provided as part of the board to
 * arrive at a number representing the hand strength, smaller is better.
 *
 * @name evaluateBoard
 * @function
 * @param {String} board the board, i.e. `'Ah Ks Td 3c Ad'`
 * @return {Number} the strength of the hand comprised by the cards of the board
 */
export function evaluateBoard(board) {
  if (typeof board !== 'string') throw new Error('board needs to be a string')
  const cards = board.trim().split(/ /)
  return evaluateCards(cards)
}

/**
 * Evaluates the 5 - 7 cards and then calculates the hand rank.
 *
 * @name rankCards
 * @function
 * @param {Array.<String>} cards the cards, i.e. `[ 'Ah', 'Ks', 'Td', '3c', 'Ad' ]`
 * @return {Number} the rank of the hand comprised by the cards, i.e. `1` for
 * `FOUR_OF_A_KIND` (enumerated in ranks)
 */
export function rankCards(cards) {
  return handRank(evaluateCards(cards))
}

/**
 * Evaluates the 5 - 7 card codes and then calculates the hand rank.
 *
 * @name rankCardCodes
 * @function
 * @param {Array.<Number>} cardCodes the card codes whose ranking to determine
 * @return {Number} the rank of the hand comprised by the card codes, i.e. `1` for
 * `FOUR_OF_A_KIND` (enumerated in ranks)
 */
export function rankCardCodes(cardCodes) {
  return handRank(phe(cardCodes))
}

/**
 * Evaluates the given board of 5 to 7 cards provided as part of the board to
 * and then calculates the hand rank.
 *
 * @name rankBoard
 * @function
 * @param {String} board the board, i.e. `'Ah Ks Td 3c Ad'`
 * @return {Number} the rank of the hand comprised by the cards, i.e. `1` for
 * `FOUR_OF_A_KIND` (enumerated in ranks)
 */
export function rankBoard(cards) {
  return handRank(evaluateBoard(cards))
}

/**
 * Converts a set of card codes to their string representations.
 *
 * @name setStringifyCardCodes
 * @function
 * @param {Set.<Number>} set card code set
 * @return {Set.<String>} set with string representations of the card codes,
 *                        i.e. `Set({'Ah', 'Ks', 'Td', '3c, 'Ad'})`
 */
export function setStringifyCardCodes(set) {
  const stringSet = new Set()
  for (const v of set) stringSet.add(stringifyCardCode(v))
  return stringSet
}

/**
 * Enumeration of possible hand ranks, each rank is a number from 0-8.
 * @name ranks
 * @function
 */
export const ranks = {
  STRAIGHT_FLUSH,
  FOUR_OF_A_KIND,
  FULL_HOUSE,
  FLUSH,
  STRAIGHT,
  THREE_OF_A_KIND,
  TWO_PAIR,
  ONE_PAIR,
  HIGH_CARD
}
