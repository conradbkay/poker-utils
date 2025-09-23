/**
 * The ranks of the cards sorted highest to lowest.
 *
 * - 2 = 0
 * - 3 = 1
 * - 4 = 2
 * - 5 = 2
 * - 6 = 4
 * - 7 = 5
 * - 8 = 6
 * - 9 = 7
 * - T = 8
 * - J = 9
 * - Q = 10
 * - K = 11
 * - A = 12
 *
 * 6 bits each.
 */
export declare const rankCodes: {
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
    8: number;
    9: number;
    T: number;
    J: number;
    Q: number;
    K: number;
    A: number;
};
export declare const rankCodeStrings: {
    0: string;
    4: string;
    8: string;
    12: string;
    16: string;
    20: string;
    24: string;
    28: string;
    32: string;
    36: string;
    40: string;
    44: string;
    48: string;
};
/**
 * The suitCodes
 *
 * - s = 0
 * - h = 1
 * - d = 2
 * - c = 3
 */
export declare const suitCodes: {
    s: number;
    h: number;
    d: number;
    c: number;
};
export declare const suitCodeStrings: string[];
/**
 * Converts the given card code into a string presentation.
 *
 * @name stringifyCardCode
 * @function
 * @param {Number} code the card code, i.e. obtained via `cardCode(rank, suit)`.
 * @return {String} a string representation of the card in question, i.e. `Ah`
 */
export declare function stringifyCardCode(code: any): string;
/**
 * Converts the given rank index into a rank.
 *
 * @name stringifyRank
 *
 * @param {Number} rank the rank to stringify, i.e. `0b000100`
 * @returns {String} the string of the rank, i.e. `'2'`
 */
export declare function stringifyRank(rank: any): any;
/**
 * Converts the given suit index to a suit.
 *
 * @param {Number} suit the suit to stringify, i.e. `0b1`
 * @returns {String} the string of the sut, i.e. `'c'` (clubs)
 */
export declare function stringifySuit(suit: any): string;
/**
 * Determines the code for the given hand.
 *
 * @name cardCode
 * @function
 * @param rank the rank of the hand, i.e. `A`
 * @param suit the suit of the hand, i.e. `h`
 * @return the card code that can be used to further evaluate the hand
 */
export declare function cardCode(rank: string, suit: string): number;
export declare function toCardCode(x: string): number;
/**
 * Determines the code for the given hands.
 *
 * @name cardCodes
 * @function
 * @param cards the cards to convert into card codes, i.e. `[ 'Ah', 'Kd' ]`
 * @return the card codes that can be used to further evaluate the hands
 */
export declare function cardCodes(cards: string[]): number[];
/**
 * Determines the code for the given hands.
 *
 * @name boardCodes
 * @function
 * @param board the board to convert into card codes, i.e. `'Ah Kd Qh'`
 * @return the card codes that can be used to further evaluate the hands
 */
export declare function boardCodes(board: string): number[];
