/**
 * Evaluates the 5 - 7 cards to arrive at a number representing the hand
 * strength, smaller is better.
 *
 * @name evaluateCards
 * @function
 * @param {Array.<String>} cards the cards, i.e. `[ 'Ah', 'Ks', 'Td', '3c', 'Ad' ]`
 * @return {Number} the strength of the hand comprised by the cards
 */
export declare function evaluateCards(cards: any): number;
/**
 * Evaluates the given board of 5 to 7 cards provided as part of the board to
 * arrive at a number representing the hand strength, smaller is better.
 *
 * @name evaluateBoard
 * @function
 * @param {String} board the board, i.e. `'Ah Ks Td 3c Ad'`
 * @return {Number} the strength of the hand comprised by the cards of the board
 */
export declare function evaluateBoard(board: any): number;
/**
 * Evaluates the 5 - 7 cards and then calculates the hand rank.
 *
 * @name rankCards
 * @function
 * @param {Array.<String>} cards the cards, i.e. `[ 'Ah', 'Ks', 'Td', '3c', 'Ad' ]`
 * @return {Number} the rank of the hand comprised by the cards, i.e. `1` for
 * `FOUR_OF_A_KIND` (enumerated in ranks)
 */
export declare function rankCards(cards: any): 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
/**
 * Evaluates the 5 - 7 card codes and then calculates the hand rank.
 *
 * @name rankCardCodes
 * @function
 * @param {Array.<Number>} cardCodes the card codes whose ranking to determine
 * @return {Number} the rank of the hand comprised by the card codes, i.e. `1` for
 * `FOUR_OF_A_KIND` (enumerated in ranks)
 */
export declare function rankCardCodes(cardCodes: any): 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
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
export declare function rankBoard(cards: any): 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
/**
 * Converts a set of card codes to their string representations.
 *
 * @name setStringifyCardCodes
 * @function
 * @param {Set.<Number>} set card code set
 * @return {Set.<String>} set with string representations of the card codes,
 *                        i.e. `Set({'Ah', 'Ks', 'Td', '3c, 'Ad'})`
 */
export declare function setStringifyCardCodes(set: any): Set<unknown>;
/**
 * Enumeration of possible hand ranks, each rank is a number from 0-8.
 * @name ranks
 * @function
 */
export declare const ranks: {
    STRAIGHT_FLUSH: number;
    FOUR_OF_A_KIND: number;
    FULL_HOUSE: number;
    FLUSH: number;
    STRAIGHT: number;
    THREE_OF_A_KIND: number;
    TWO_PAIR: number;
    ONE_PAIR: number;
    HIGH_CARD: number;
};
