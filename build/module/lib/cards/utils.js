"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randUniqueCards = exports.boardToInts = exports.shuffle = exports.deckWithoutSpecifiedCards = exports.mostSuit = exports.suitCounts = exports.highCard = exports.straightPossible = exports.oesdPossible = exports.calcStraightOuts = exports.containsStraight = exports.suitCount = exports.formatCards = exports.formatCard = exports.fromCardsStr = exports.cardsStr = exports.makeCard = exports.uniqueRanks = exports.getRank = exports.getSuit = void 0;
const constants_1 = require("../constants");
const constants_2 = require("../constants");
/**
 * these utils assume a deck from 0-51
 */
/** returns 0-3 */
const getSuit = (card) => card & 3;
exports.getSuit = getSuit;
/** returns 0 for 2, 12 for ace */
const getRank = (card) => card >> 2;
exports.getRank = getRank;
const MIN_RANK = (0, exports.getRank)(constants_2.DECK['2s']);
const ACE_RANK = (0, exports.getRank)(constants_2.DECK['As']);
/** returns array of ranks */
const uniqueRanks = (board) => Array.from(new Set(board.map((c) => (0, exports.getRank)(c))));
exports.uniqueRanks = uniqueRanks;
const makeCard = (rank, suit) => (rank << 2) | suit;
exports.makeCard = makeCard;
/** for non user-facing purposes where dealing with str is easier than arr */
const cardsStr = (cards) => cards.join(',');
exports.cardsStr = cardsStr;
const fromCardsStr = (str) => str.split(',').map((s) => parseInt(s)); // .map(parseInt) would pass index as second param which is radix (base)
exports.fromCardsStr = fromCardsStr;
/**
 * returns 'Ks', '9h' style formatted. empty string for unknown card
 */
const formatCard = (card) => constants_1.c2str[card] || '';
exports.formatCard = formatCard;
const formatCards = (cards) => cards.map(exports.formatCard);
exports.formatCards = formatCards;
const suitCount = (cards) => new Set(cards.map((c) => (0, exports.getSuit)(c))).size;
exports.suitCount = suitCount;
/**
 * for textural analysis where you don't just want the strongest possible hand (a board could have a straight and a flush which returns true here)
 */
const containsStraight = (board) => {
    const ranks = (0, exports.uniqueRanks)(board).sort((a, b) => a - b);
    // wheel
    if (ranks[0] === 0 &&
        ranks[1] === 1 &&
        ranks[2] === 2 &&
        ranks[3] === 3 &&
        ranks[ranks.length - 1] === ACE_RANK) {
        return true;
    }
    outer: for (let start = 0; start <= ranks.length - 5; start++) {
        for (let j = start; j < start + 4; j++) {
            if (ranks[j] + 1 !== ranks[j + 1]) {
                continue outer;
            }
        }
        return true;
    }
    return false;
};
exports.containsStraight = containsStraight;
/** returns 0, 4, 8. 0 if board already is a straight */
const calcStraightOuts = (board) => {
    if ((0, exports.containsStraight)(board)) {
        return 0;
    }
    let result = 0;
    // loop unique ranks since suits don't affect straights
    for (let i = 0; i < 52; i += 4) {
        const hypothetical = [...board, i];
        if ((0, exports.containsStraight)(hypothetical)) {
            result += 4; // we know all 4 suits aren't on the board if adding the rank creates a straight
        }
    }
    return result;
};
exports.calcStraightOuts = calcStraightOuts;
// from script ran from ../hashing/flops.ts
const nonOesdFlopRanks = [
    '0',
    '1',
    '0,1,2',
    '2',
    '0,1,3',
    '0,2,3',
    '1,2,3',
    '3',
    '0,4',
    '0,1,4',
    '0,2,4',
    '1,2,4',
    '0,3,4',
    '1,3,4',
    '2,3,4',
    '4',
    '0,5',
    '1,5',
    '1,2,5',
    '1,3,5',
    '2,3,5',
    '1,4,5',
    '2,4,5',
    '3,4,5',
    '5',
    '0,6',
    '1,6',
    '2,6',
    '2,3,6',
    '2,4,6',
    '3,4,6',
    '2,5,6',
    '3,5,6',
    '4,5,6',
    '6',
    '0,7',
    '1,7',
    '2,7',
    '3,7',
    '3,4,7',
    '3,5,7',
    '4,5,7',
    '3,6,7',
    '4,6,7',
    '5,6,7',
    '7',
    '0,8',
    '1,8',
    '2,8',
    '3,8',
    '0,4,8',
    '4,8',
    '4,5,8',
    '4,6,8',
    '5,6,8',
    '4,7,8',
    '5,7,8',
    '6,7,8',
    '8',
    '0,9',
    '1,9',
    '2,9',
    '3,9',
    '0,4,9',
    '4,9',
    '0,5,9',
    '1,5,9',
    '5,9',
    '5,6,9',
    '5,7,9',
    '6,7,9',
    '5,8,9',
    '6,8,9',
    '7,8,9',
    '9',
    '0,10',
    '1,10',
    '2,10',
    '3,10',
    '0,4,10',
    '4,10',
    '0,5,10',
    '1,5,10',
    '5,10',
    '0,6,10',
    '1,6,10',
    '2,6,10',
    '6,10',
    '6,7,10',
    '6,8,10',
    '7,8,10',
    '6,9,10',
    '7,9,10',
    '8,9,10',
    '10',
    '0,11',
    '1,11',
    '2,11',
    '3,11',
    '0,4,11',
    '4,11',
    '0,5,11',
    '1,5,11',
    '5,11',
    '0,6,11',
    '1,6,11',
    '2,6,11',
    '6,11',
    '0,7,11',
    '1,7,11',
    '2,7,11',
    '3,7,11',
    '7,11',
    '7,8,11',
    '7,9,11',
    '8,9,11',
    '7,10,11',
    '8,10,11',
    '9,10,11',
    '11',
    '0,12',
    '0,1,12',
    '1,12',
    '0,2,12',
    '1,2,12',
    '2,12',
    '0,3,12',
    '1,3,12',
    '2,3,12',
    '3,12',
    '0,4,12',
    '4,12',
    '0,5,12',
    '5,12',
    '0,6,12',
    '1,6,12',
    '2,6,12',
    '6,12',
    '0,7,12',
    '1,7,12',
    '2,7,12',
    '3,7,12',
    '7,12',
    '0,8,12',
    '1,8,12',
    '2,8,12',
    '3,8,12',
    '4,8,12',
    '8,12',
    '0,9,12',
    '1,9,12',
    '2,9,12',
    '3,9,12',
    '4,9,12',
    '5,9,12',
    '8,9,12',
    '9,12',
    '0,10,12',
    '1,10,12',
    '2,10,12',
    '3,10,12',
    '4,10,12',
    '5,10,12',
    '8,10,12',
    '9,10,12',
    '10,12',
    '0,11,12',
    '1,11,12',
    '2,11,12',
    '3,11,12',
    '4,11,12',
    '5,11,12',
    '6,11,12',
    '7,11,12',
    '8,11,12',
    '9,11,12',
    '10,11,12',
    '11,12',
    '12'
];
/* returns false is straight already possible  */
const oesdPossible = (board) => {
    const ranks = (0, exports.uniqueRanks)(board).sort((a, b) => a - b);
    if (board.length === 3) {
        return !nonOesdFlopRanks.includes(ranks.join(','));
    }
    if ((0, exports.straightPossible)(board)) {
        return false;
    }
    if (ranks.length < 2)
        return false;
    // Try all rank pairs (including pairs) for hole cards.
    for (let r1 = MIN_RANK; r1 <= ACE_RANK; r1++) {
        for (let r2 = r1; r2 <= ACE_RANK; r2++) {
            const c1 = (0, exports.makeCard)(r1, 0);
            const c2 = (0, exports.makeCard)(r2, r1 === r2 ? 1 : 0);
            const hypothetical = [...board, c1, c2];
            if ((0, exports.calcStraightOuts)(hypothetical) === 8) {
                return true;
            }
        }
    }
    return false;
};
exports.oesdPossible = oesdPossible;
// returns whether you can add 2 cards to the board to make a straight
const straightPossible = (board) => {
    const ranks = (0, exports.uniqueRanks)(board).sort((a, b) => a - b);
    if (ranks.length < 3)
        return false;
    // wheels
    if (ranks.filter((r) => r <= (0, exports.getRank)(constants_2.DECK['5s'])).length >= 2 &&
        ranks[ranks.length - 1] === ACE_RANK) {
        return true;
    }
    for (let i = 0; i < ranks.length - 2; i++) {
        // [2, 4, 6] diff is 4
        if (ranks[i + 2] - ranks[i] <= 4) {
            return true;
        }
    }
    return false;
};
exports.straightPossible = straightPossible;
const highCard = (board) => Math.max(...board.map(exports.getRank));
exports.highCard = highCard;
const suitCounts = (board) => {
    return board.reduce((accum, cur) => {
        accum[(0, exports.getSuit)(cur)]++;
        return accum;
    }, [0, 0, 0, 0]);
};
exports.suitCounts = suitCounts;
const mostSuit = (board) => Math.max(...(0, exports.suitCounts)(board));
exports.mostSuit = mostSuit;
const deckWithoutSpecifiedCards = (cards) => {
    const used = new Set(cards);
    return Object.values(constants_2.DECK).filter((name) => !used.has(name));
};
exports.deckWithoutSpecifiedCards = deckWithoutSpecifiedCards;
/**
 * TS implementation of https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
 * Code from https://stackoverflow.com/a/12646864
 */
const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};
exports.shuffle = shuffle;
const boardToInts = (board) => {
    if (Array.isArray(board)) {
        return board.map((card) => (0, exports.boardToInts)(card)).flat();
    }
    const boardInts = [];
    board = board.replaceAll(' ', '');
    for (let i = 0; i < board.length; i += 2) {
        boardInts.push(constants_2.DECK[board[i].toUpperCase() + board[i + 1].toLowerCase()]);
    }
    return boardInts;
};
exports.boardToInts = boardToInts;
const randUniqueCards = (count) => {
    if (count > 10) {
        return (0, exports.shuffle)([...constants_1.CARDS]).slice(0, count);
    }
    let result = [];
    while (result.length < count) {
        let next = Math.floor(Math.random() * 52);
        if (!result.includes(next)) {
            result.push(next);
        }
    }
    return result;
};
exports.randUniqueCards = randUniqueCards;
