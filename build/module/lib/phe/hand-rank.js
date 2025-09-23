"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rankDescription = exports.HIGH_CARD = exports.ONE_PAIR = exports.TWO_PAIR = exports.THREE_OF_A_KIND = exports.STRAIGHT = exports.FLUSH = exports.FULL_HOUSE = exports.FOUR_OF_A_KIND = exports.STRAIGHT_FLUSH = void 0;
exports.handRank = handRank;
exports.STRAIGHT_FLUSH = 0;
exports.FOUR_OF_A_KIND = 1;
exports.FULL_HOUSE = 2;
exports.FLUSH = 3;
exports.STRAIGHT = 4;
exports.THREE_OF_A_KIND = 5;
exports.TWO_PAIR = 6;
exports.ONE_PAIR = 7;
exports.HIGH_CARD = 8;
/**
 * Provides a description of a hand rank number.
 * It's an {Array} which can be indexed into with the hand rank
 * in order to retrieve the matching description.
 *
 * Example: `rankDescription[rank.FULL_HOUSE] === 'Full House'`
 *
 * @name rankDescription
 */
exports.rankDescription = [
    'Straight Flush',
    'Four of a Kind',
    'Full House',
    'Flush',
    'Straight',
    'Three of a Kind',
    'Two Pair',
    'One Pair',
    'High Card'
];
/**
 * Converts a hand strength number into a hand rank number
 * `0 - 8` for `STRAIGHT_FLUSH - HIGH_CARD`.
 *
 * @name handRank
 * @function
 * @param val hand strength (result of an `evaluate` function)
 * @return the hand rank
 */
function handRank(val) {
    if (val > 6185)
        return exports.HIGH_CARD; // 1277 high card
    if (val > 3325)
        return exports.ONE_PAIR; // 2860 one pair
    if (val > 2467)
        return exports.TWO_PAIR; //  858 two pair
    if (val > 1609)
        return exports.THREE_OF_A_KIND; //  858 three-kind
    if (val > 1599)
        return exports.STRAIGHT; //   10 straights
    if (val > 322)
        return exports.FLUSH; // 1277 flushes
    if (val > 166)
        return exports.FULL_HOUSE; //  156 full house
    if (val > 10)
        return exports.FOUR_OF_A_KIND; //  156 four-kind
    return exports.STRAIGHT_FLUSH; //   10 straight-flushes
}
