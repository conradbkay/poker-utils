"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isoWeight = exports.totalIsoWeight = exports.getIsoHand = exports.canonizeBoard = exports.sortBoard = exports.isoRunouts = exports.canonize = exports.iso = void 0;
const utils_1 = require("./cards/utils");
const sort_1 = require("./sort");
/** PioSOLVER format */
const iso = ({ board, hand }) => {
    const { suitMap, cards } = (0, exports.canonizeBoard)(board);
    return {
        board: cards,
        hand: hand ? (0, exports.getIsoHand)(hand, suitMap) : undefined
    };
};
exports.iso = iso;
/**
 * very fast (~12.5m flops/s) since loops only rarely execute. Even hashing the results would be slower
 *
 * expects and returns sorted board
 */
const canonize = (cards, initSuitMap) => {
    let suits = cards.map(utils_1.getSuit);
    let ranks = cards.map(utils_1.getRank);
    const suitMap = initSuitMap ? [...initSuitMap] : [-1, -1, -1, -1];
    let nextSuit = getNextSuit(suitMap);
    // for AhAcKc and AhAcKh we need to convert both to AsAhKs and not prior to AsAhKh
    // we only need to check the flop because it's the only sortable street
    // we only check first 2 because something like AhKcKh vs AhKhKc sorts to the same board
    if (ranks[0] === ranks[1] && suits[1] === suits[2]) {
        ;
        [cards[0], cards[1]] = [cards[1], cards[0]];
        suits = [suits[1], suits[0], suits[2]];
        ranks = [ranks[1], ranks[0], ranks[2]];
    }
    for (const suit of suits) {
        if (suitMap[suit] === -1) {
            suitMap[suit] = nextSuit;
            nextSuit--;
        }
    }
    const isoCards = cards.map((_, i) => (0, utils_1.makeCard)(ranks[i], suitMap[suits[i]]));
    return {
        suitMap,
        nextSuit,
        cards: (0, exports.sortBoard)(isoCards)
    };
};
exports.canonize = canonize;
/** gets all runouts, set recursive = false to just return the next street */
const isoRunouts = (board, weightMult = 1, recursive = true) => {
    const runouts = {};
    forEachIso(board, (isoBoard, c, map, weight) => {
        weight *= weightMult;
        runouts[c] ??= { weight: 0, map };
        runouts[c].weight += weight;
        if (board.length === 3 && recursive) {
            runouts[c].children = (0, exports.isoRunouts)([...isoBoard, c], runouts[c].weight);
        }
    });
    return runouts;
};
exports.isoRunouts = isoRunouts;
/** returns runouts AFTER applying flop isomorphism */
const forEachIso = (board, f) => {
    const { suitMap, nextSuit, cards } = (0, exports.canonizeBoard)(board);
    let boardSet = new Set(cards);
    for (let suit = 3; suit >= nextSuit; suit--) {
        let weight = 1;
        if (suit < 0)
            break;
        if (suit === nextSuit) {
            suitMap[suit] = suit;
            weight = suit + 1; // if suit is 3, that means it represents 0 1 2 3
        }
        for (let rank = 0; rank < 13; rank++) {
            let c = (0, utils_1.makeCard)(rank, suit);
            if (boardSet.has(c))
                continue;
            f(cards, c, suitMap, weight);
        }
    }
};
const sortBoard = (cards) => (0, sort_1.sortCards)(cards, Math.min(3, cards.length)); // sort 1st 3 cards only
exports.sortBoard = sortBoard;
const canonizeBoard = (board, map) => (0, exports.canonize)((0, exports.sortBoard)([...board]), map);
exports.canonizeBoard = canonizeBoard;
const getIsoHand = (hand, map) => (0, sort_1.sortCards)((0, exports.canonize)((0, sort_1.sortCards)([...hand]), map).cards);
exports.getIsoHand = getIsoHand;
const numSuits = (board) => new Set(board.map((card) => (0, utils_1.getSuit)(card))).size;
const getNextSuit = (suitMap) => {
    let nextSuit = 3;
    for (const suit of suitMap) {
        if (suit !== -1 && suit <= nextSuit) {
            nextSuit = suit - 1;
        }
    }
    return nextSuit;
};
// mostly for testing, counts number of nodes if wasn't isomorphic
const totalIsoWeight = (runouts) => {
    let result = 0;
    for (const c in runouts) {
        result += runouts[c].weight;
        if (runouts[c].children) {
            result += (0, exports.totalIsoWeight)(runouts[c].children);
        }
    }
    return result;
};
exports.totalIsoWeight = totalIsoWeight;
/**
 * returns how many strategically similar boards could be created from passed board
 *
 * can pass board pre or post-isomorphism and get same results
 */
const isoWeight = (board) => {
    let sc = numSuits(board);
    return [4, 12, 24, 24][sc - 1];
};
exports.isoWeight = isoWeight;
