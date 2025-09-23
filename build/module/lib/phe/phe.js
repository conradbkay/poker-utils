"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ranks = void 0;
exports.evaluateCards = evaluateCards;
exports.evaluateBoard = evaluateBoard;
exports.rankCards = rankCards;
exports.rankCardCodes = rankCardCodes;
exports.rankBoard = rankBoard;
exports.setStringifyCardCodes = setStringifyCardCodes;
const hand_rank_1 = require("./hand-rank");
const hand_code_1 = require("./hand-code");
const evaluate_1 = require("./evaluate");
/**
 * Evaluates the 5 - 7 cards to arrive at a number representing the hand
 * strength, smaller is better.
 *
 * @name evaluateCards
 * @function
 * @param {Array.<String>} cards the cards, i.e. `[ 'Ah', 'Ks', 'Td', '3c', 'Ad' ]`
 * @return {Number} the strength of the hand comprised by the cards
 */
function evaluateCards(cards) {
    const codes = (0, hand_code_1.cardCodes)(cards);
    return (0, evaluate_1.getPHEValue)(codes);
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
function evaluateBoard(board) {
    if (typeof board !== 'string')
        throw new Error('board needs to be a string');
    const cards = board.trim().split(/ /);
    return evaluateCards(cards);
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
function rankCards(cards) {
    return (0, hand_rank_1.handRank)(evaluateCards(cards));
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
function rankCardCodes(cardCodes) {
    return (0, hand_rank_1.handRank)((0, evaluate_1.getPHEValue)(cardCodes));
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
function rankBoard(cards) {
    return (0, hand_rank_1.handRank)(evaluateBoard(cards));
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
function setStringifyCardCodes(set) {
    const stringSet = new Set();
    for (const v of set)
        stringSet.add((0, hand_code_1.stringifyCardCode)(v));
    return stringSet;
}
/**
 * Enumeration of possible hand ranks, each rank is a number from 0-8.
 * @name ranks
 * @function
 */
exports.ranks = {
    STRAIGHT_FLUSH: hand_rank_1.STRAIGHT_FLUSH,
    FOUR_OF_A_KIND: hand_rank_1.FOUR_OF_A_KIND,
    FULL_HOUSE: hand_rank_1.FULL_HOUSE,
    FLUSH: hand_rank_1.FLUSH,
    STRAIGHT: hand_rank_1.STRAIGHT,
    THREE_OF_A_KIND: hand_rank_1.THREE_OF_A_KIND,
    TWO_PAIR: hand_rank_1.TWO_PAIR,
    ONE_PAIR: hand_rank_1.ONE_PAIR,
    HIGH_CARD: hand_rank_1.HIGH_CARD
};
