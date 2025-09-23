"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addGaps = exports.removeGaps = exports.valueFromPHE = exports.typeFromPHE = exports.cardsFromPHE = exports.cardsToPHE = exports.fromPHE = exports.toPHE = void 0;
const constants_1 = require("../constants");
const constants_2 = require("../constants");
const hand_code_1 = require("./hand-code");
const _toPHE = (card) => (0, hand_code_1.toCardCode)(constants_1.c2str[card]);
const _fromPHE = (code) => constants_2.DECK[(0, hand_code_1.stringifyCardCode)(code)];
exports.toPHE = new Array(52).fill(0).map((_, i) => _toPHE(i));
exports.fromPHE = new Array(52).fill(0).map((_, i) => _fromPHE(i));
const cardsToPHE = (cards) => cards.map((c) => exports.toPHE[c]);
exports.cardsToPHE = cardsToPHE;
const cardsFromPHE = (codes) => codes.map((c) => exports.fromPHE[c]);
exports.cardsFromPHE = cardsFromPHE;
// 0 -> 9, 1 -> 8, "type" as in idx of "three of a kind" etc
exports.typeFromPHE = new Array(9).fill(0).map((_, i) => 9 - i);
/**
 * PHE goes from 1 (strongest) to 7462 (weakest)
 * this just reverses that order
 */
const valueFromPHE = (evalN) => {
    return 7463 - evalN;
};
exports.valueFromPHE = valueFromPHE;
// starting from x, how much we need to subtract
const subtractCutoffs = [
    [0, 4096],
    [5374, 6915],
    [11053, 8151],
    [13147, 11389],
    [17243, 14627],
    [20491, 18713],
    [25854, 21532],
    [28829, 25472],
    [32925, 29412]
];
/**
 * 2p2 eval skips certain ranges since they're used as locations in the lookup table
 */
const removeGaps = (evalN) => {
    for (let i = subtractCutoffs.length - 1; i >= 0; i--) {
        if (evalN >= subtractCutoffs[i][0]) {
            return evalN - subtractCutoffs[i][1];
        }
    }
    throw new Error('invalid 2p2 value ' + evalN);
};
exports.removeGaps = removeGaps;
const addGaps = (pheVal) => {
    for (let i = subtractCutoffs.length - 1; i > 0; i--) {
        const [cutoff, subtract] = subtractCutoffs[i];
        const pheStart = cutoff - subtractCutoffs[i - 1][1];
        // Calculate what the original number (evalN) would have been
        if (pheVal >= pheStart) {
            return pheVal + subtract;
        }
    }
    return pheVal + 4096;
};
exports.addGaps = addGaps;
