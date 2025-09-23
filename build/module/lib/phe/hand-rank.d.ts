export declare const STRAIGHT_FLUSH = 0;
export declare const FOUR_OF_A_KIND = 1;
export declare const FULL_HOUSE = 2;
export declare const FLUSH = 3;
export declare const STRAIGHT = 4;
export declare const THREE_OF_A_KIND = 5;
export declare const TWO_PAIR = 6;
export declare const ONE_PAIR = 7;
export declare const HIGH_CARD = 8;
/**
 * Provides a description of a hand rank number.
 * It's an {Array} which can be indexed into with the hand rank
 * in order to retrieve the matching description.
 *
 * Example: `rankDescription[rank.FULL_HOUSE] === 'Full House'`
 *
 * @name rankDescription
 */
export declare const rankDescription: string[];
/**
 * Converts a hand strength number into a hand rank number
 * `0 - 8` for `STRAIGHT_FLUSH - HIGH_CARD`.
 *
 * @name handRank
 * @function
 * @param val hand strength (result of an `evaluate` function)
 * @return the hand rank
 */
export declare function handRank(val: number): 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
