"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalOmaha = exports.genBoardEval = exports.evaluate = exports.phe = void 0;
const permuHash_1 = require("./cards/permuHash");
const init_1 = require("./init");
const convert_1 = require("./phe/convert");
const evaluate_1 = require("./phe/evaluate");
const strength_1 = require("./twoplustwo/strength");
const strength_2 = require("./twoplustwo/strength");
/** exact same input/output as twoplustwo algorithm */
const phe = (cards) => {
    return (0, convert_1.addGaps)((0, convert_1.valueFromPHE)((0, evaluate_1.getPHEValue)((0, convert_1.cardsToPHE)(cards))));
};
exports.phe = phe;
const evaluate = (cards) => init_1.RANKS_DATA ? (0, strength_1.twoplustwoEvaluate)(cards) : (0, strength_2.pInfo)((0, exports.phe)(cards));
exports.evaluate = evaluate;
const genBoardEval = (board, evalFunc = strength_1.fastEval) => {
    if (!init_1.RANKS_DATA)
        return (h) => (0, exports.evaluate)([...board, ...h]).value;
    let boardP = (0, strength_1.fastEval)(board);
    return board.length === 5
        ? (hand) => evalFunc(hand, boardP)
        : (hand) => (0, strength_1.finalP)(evalFunc(hand, boardP));
};
exports.genBoardEval = genBoardEval;
const evalOmaha = (board, holeCards) => {
    // in Omaha you need to use exactly 2 hole cards and therefore 3 from the board
    const holeIdxsArr = permuHash_1.hash[holeCards.length][2];
    const boardIdxsArr = permuHash_1.hash[board.length][3];
    let max = -Infinity;
    for (const boardIdxs of boardIdxsArr) {
        const handEval = (0, exports.genBoardEval)([
            board[boardIdxs[0]],
            board[boardIdxs[1]],
            board[boardIdxs[2]]
        ]);
        for (const holeIdxs of holeIdxsArr) {
            const p = handEval([holeCards[holeIdxs[0]], holeCards[holeIdxs[1]]]);
            if (p > max) {
                max = p;
            }
        }
    }
    return (0, strength_2.pInfo)(max);
};
exports.evalOmaha = evalOmaha;
