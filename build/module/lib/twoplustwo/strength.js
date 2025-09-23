"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twoplustwoEvaluate = exports.pInfo = exports.genOmahaBoardEval = exports.fastEvalPartial = exports.fastEval = exports.finalP = void 0;
const permuHash_1 = require("../cards/permuHash");
const constants_1 = require("../twoplustwo/constants");
const init_1 = require("../init");
const convert_1 = require("../phe/convert");
/** assumes 0-indexed deck, but lookup uses 1-indexed */
function nextP(card) {
    return init_1.RANKS_DATA.readUInt32LE(card * 4 + 4);
}
const finalP = (p) => init_1.RANKS_DATA.readUInt32LE(p * 4);
exports.finalP = finalP;
/**
 * ~1.3x faster than `evaluate`, but just returns `value`
 *
 * doesn't return the correct final values for 5/6 cards, use fastEvalPartial for that
 */
const fastEval = (cards, p = 53) => {
    for (const card of cards) {
        p = nextP(p + card);
    }
    return p;
};
exports.fastEval = fastEval;
// can take 5-7 cards
const fastEvalPartial = (cards, p = 53) => {
    p = (0, exports.fastEval)(cards, p);
    if (cards.length === 5 || cards.length === 6) {
        return (0, exports.finalP)(p);
    }
    return p;
};
exports.fastEvalPartial = fastEvalPartial;
// 2p2 eval only
const genOmahaBoardEval = (board) => {
    const boardIdxsArr = permuHash_1.hash[board.length][3];
    const boardPs = boardIdxsArr.map(([i1, i2, i3]) => (0, exports.fastEval)([board[i1], board[i2], board[i3]]));
    return (hand) => Math.max(...boardPs.map((p) => (0, exports.fastEval)(hand, p)));
}; // copied from https://github.com/Sukhmai/poker-evaluator
exports.genOmahaBoardEval = genOmahaBoardEval;
const pInfo = (p) => ({
    handType: p >> 12,
    handRank: p & 0x00000fff,
    p,
    value: (0, convert_1.removeGaps)(p),
    handName: constants_1.HAND_TYPES[p >> 12]
});
exports.pInfo = pInfo;
const twoplustwoEvaluate = (cardValues) => {
    return (0, exports.pInfo)((0, exports.fastEvalPartial)(cardValues));
};
exports.twoplustwoEvaluate = twoplustwoEvaluate;
