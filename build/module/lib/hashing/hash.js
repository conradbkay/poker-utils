"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equityFromHash = exports.generateEquityHash = exports.flopEquities = void 0;
const range_1 = require("../range/range");
const flops_1 = require("./flops");
const constants_1 = require("../constants");
const iso_1 = require("../iso");
const utils_1 = require("../utils");
const holdem_1 = require("../range/holdem");
const utils_2 = require("../cards/utils");
/**
 * Flops are the most computationally expensive to calculate equities for
 * There's only 1755 unique flops after applying isomorphism, so we can precompute every combo's equity vs a specific range for every flop
 */
/**
 * buckets all NLHE combos by equity. Assumes flop is already isomorphic
 *
 * it's tempting to convert flops into an iso index and then use a giant, flattened 1755x1326x23 uint16array and bypass json costs
 *
 * todo make this more general to allow for things like storing [win, tie, lose] aggregate, or bucketing into percentiles of range rather than equity
 */
const flopEquities = (flop, vsRange, chopReduction = 'skip') => {
    const hash = new Array(1326);
    // hands that collide with flop should remain undefined to conserve space
    for (let idx = 0; idx < 1326; idx++) {
        const combo = holdem_1.HoldemRange.fromHandIdx(idx);
        if (combo.some((c) => flop.includes(c)))
            continue;
        hash[idx] = new Array(constants_1.equityBuckets.length).fill(0);
    }
    const range = holdem_1.HoldemRange.fromPokerRange(range_1.any2);
    const board = [...flop, undefined, undefined];
    // for bucketing we can consider turn and river sortable. That is, there's no need to do 43,30 and 30,43 since they're equivalent and ranges stay fixed
    for (let turn = 51; turn >= 1; turn--) {
        if (flop.includes(turn))
            continue;
        board[3] = turn;
        for (let river = turn - 1; river >= 0; river--) {
            if (turn === river || flop.includes(river))
                continue;
            board[4] = river;
            const result = range.equityVsRange({
                board,
                vsRange
            });
            for (let [combo, win, tie, lose] of result) {
                let bucket;
                let denom = win + lose;
                if (chopReduction === 'win') {
                    win += tie;
                    denom += tie;
                }
                else if (chopReduction === 'half') {
                    win += tie / 2;
                    denom += tie;
                }
                else {
                    // skip
                }
                if (!denom)
                    continue;
                const eq = win / denom;
                bucket = (0, utils_1.closestIdx)(constants_1.equityBuckets, eq * 100);
                hash[holdem_1.HoldemRange.getHandIdx(combo)][bucket] += 1;
            }
        }
    }
    return hash;
};
exports.flopEquities = flopEquities;
const flopToHashKey = (flop) => (0, utils_2.formatCards)((0, iso_1.canonizeBoard)(flop).cards).join('');
const generateEquityHash = (vsRange) => {
    const hash = {};
    for (const [_, flop] of flops_1.flops) {
        const equities = (0, exports.flopEquities)(flop, vsRange);
        hash[flopToHashKey(flop)] = equities;
    }
    return hash;
};
exports.generateEquityHash = generateEquityHash;
const equityFromHash = (hash, flop, hand) => {
    const { board, hand: isoHand } = (0, iso_1.iso)({ board: flop, hand });
    return hash[flopToHashKey(board)][holdem_1.HoldemRange.getHandIdx(isoHand)];
};
exports.equityFromHash = equityFromHash;
