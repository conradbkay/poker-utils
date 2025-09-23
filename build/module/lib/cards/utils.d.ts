/**
 * these utils assume a deck from 0-51
 */
/** returns 0-3 */
export declare const getSuit: (card: number) => number;
/** returns 0 for 2, 12 for ace */
export declare const getRank: (card: number) => number;
/** returns array of ranks */
export declare const uniqueRanks: (board: number[]) => number[];
export declare const makeCard: (rank: number, suit: number) => number;
/** for non user-facing purposes where dealing with str is easier than arr */
export declare const cardsStr: (cards: number[]) => string;
export declare const fromCardsStr: (str: string) => number[];
/**
 * returns 'Ks', '9h' style formatted. empty string for unknown card
 */
export declare const formatCard: (card: number) => string;
export declare const formatCards: (cards: number[]) => string[];
export declare const suitCount: (cards: number[]) => number;
/**
 * for textural analysis where you don't just want the strongest possible hand (a board could have a straight and a flush which returns true here)
 */
export declare const containsStraight: (board: number[]) => boolean;
export declare const calcStraightOuts: (board: number[]) => number;
export declare const straightPossible: (board: number[]) => boolean;
export declare const highCard: (board: number[]) => number;
export declare const suitCounts: (board: number[]) => number[];
export declare const mostSuit: (board: number[]) => number;
export declare const deckWithoutSpecifiedCards: (cards: number[]) => (0 | 2 | 1 | 22 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 25 | 50 | 30 | 35 | 40 | 45 | 23 | 24 | 26 | 27 | 28 | 29 | 31 | 32 | 33 | 34 | 36 | 37 | 38 | 39 | 41 | 42 | 43 | 44 | 46 | 47 | 48 | 49 | 51)[];
/**
 * TS implementation of https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
 * Code from https://stackoverflow.com/a/12646864
 */
export declare const shuffle: (arr: number[]) => number[];
export declare const boardToInts: (board: string | string[] | number[]) => number[];
export declare const randUniqueCards: (count: number) => number[];
