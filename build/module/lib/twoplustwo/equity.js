"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.omahaAheadScore = exports.rangeVsRangeAhead = exports.combosVsRangeAhead = exports.aheadPct = exports.equityEval = void 0;
const evaluate_1 = require("../evaluate");
const sort_1 = require("../sort");
const evaluate_2 = require("../evaluate");
// returns equity for every river, or whatever the flop hash returns/contains
const equityEval = ({ board, hand, vsRange, chopIsWin }) => {
    if (board.length === 3) {
        const result = [];
        for (let j = 0; j < 52; j++) {
            if (board.includes(j)) {
                continue;
            }
            result.push(...(0, exports.equityEval)({
                hand,
                vsRange,
                chopIsWin,
                board: [...board, j]
            }));
        }
        return result;
    }
    else {
        const evalOptions = {
            hand,
            chopIsWin
        };
        const evalFunc = hand.length >= 4 ? exports.omahaAheadScore : exports.aheadPct;
        if (board.length === 4) {
            const result = [];
            for (let j = 0; j < 52; j++) {
                if (board.includes(j) || hand.includes(j)) {
                    continue;
                }
                result.push(evalFunc({ ...evalOptions, board: [...board, j] }, vsRange));
            }
            return result;
        }
        else {
            return evalFunc({ ...evalOptions, board }, vsRange);
        }
    }
};
exports.equityEval = equityEval;
// doesn't account for runouts, just what % of hands you're ahead of currently
const aheadPct = ({ board, hand }, vsRange, evalFunc) => {
    const blocked = new Set([...hand, ...board]);
    if (!evalFunc) {
        const boardEval = (0, evaluate_2.genBoardEval)(board);
        evalFunc = (_, h) => boardEval(h);
    }
    const vsRangeRankings = getRangeRankings(vsRange, (h) => evalFunc(board, h), blocked);
    const handRanking = evalFunc(board, hand);
    let wins = 0;
    let losses = 0;
    let ties = 0;
    for (const [_, value, weight] of vsRangeRankings) {
        if (handRanking > value) {
            wins += weight;
        }
        else if (handRanking === value) {
            ties += weight;
        }
        else {
            losses += weight;
        }
    }
    return [wins, ties, losses];
};
exports.aheadPct = aheadPct;
/** returns [hand, p, weight][] */
const getRangeRankings = (r, evalHand, blocked) => {
    let result = [];
    r.forEach((combo, weight) => {
        if (combo.some((c) => blocked.has(c)))
            return;
        const strength = evalHand(combo);
        result.push([combo, strength, weight]);
    });
    return result;
};
/**
 * returns [combo, [wins, losses, ties], weight][]
 */
const combosVsRangeAhead = ({ board, range, vsRange }) => {
    const blocked = new Set(board);
    const isOmaha = range.getHandLen() >= 4;
    const evalHand = isOmaha
        ? (hand) => (0, evaluate_1.evalOmaha)(board, hand).value
        : (0, evaluate_2.genBoardEval)(board);
    const rangeRankings = getRangeRankings(range, evalHand, blocked);
    const vsRangeRankings = getRangeRankings(vsRange, evalHand, blocked);
    // sort by strength ascending
    rangeRankings.sort((a, b) => a[1] - b[1]);
    vsRangeRankings.sort((a, b) => a[1] - b[1]);
    const result = [];
    for (let i = 0; i < rangeRankings.length; i++) {
        const [hand, handRanking, weight] = rangeRankings[i];
        let wins = 0;
        let losses = 0;
        let ties = 0;
        let totalWeight = 0;
        for (let vsIdx = 0; vsIdx < vsRangeRankings.length; vsIdx++) {
            const [vsHand, vsRanking, vsWeight] = vsRangeRankings[vsIdx];
            if (vsHand.some((c) => hand.includes(c))) {
                continue; // blockers
            }
            if (handRanking > vsRanking) {
                wins += vsWeight;
            }
            else if (handRanking === vsRanking) {
                ties += vsWeight;
            }
            else {
                losses += vsWeight;
            }
            totalWeight += vsWeight;
        }
        if (totalWeight > 0) {
            result.push([
                (0, sort_1.sortCards)(hand),
                [wins / totalWeight, ties / totalWeight, losses / totalWeight],
                weight
            ]);
        }
    }
    return result;
};
exports.combosVsRangeAhead = combosVsRangeAhead;
// returns average ahead of range
const rangeVsRangeAhead = (args) => {
    const res = (0, exports.combosVsRangeAhead)(args);
    const totalWins = res.reduce((a, c) => a + c[1][0] * c[2], 0);
    const totalTies = res.reduce((a, c) => a + c[1][1] * c[2], 0);
    const totalLosses = res.reduce((a, c) => a + c[1][2] * c[2], 0);
    const totalWeight = totalWins + totalTies + totalLosses;
    if (totalWeight <= 0)
        return [0, 0, 0];
    return [
        totalWins / totalWeight,
        totalTies / totalWeight,
        totalLosses / totalWeight
    ];
};
exports.rangeVsRangeAhead = rangeVsRangeAhead;
const omahaAheadScore = (evalOptions, vsRange) => {
    const [wins, ties, losses] = (0, exports.aheadPct)(evalOptions, vsRange, (b, h) => (0, evaluate_1.evalOmaha)(b, h).value);
    const total = wins + ties + losses;
    if (total === 0)
        return [0, 0, 0];
    return [wins / total, ties / total, losses / total];
};
exports.omahaAheadScore = omahaAheadScore;
