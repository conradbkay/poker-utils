"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genRandRange = exports.any2 = exports.PokerRange = void 0;
const utils_1 = require("../cards/utils");
const sort_1 = require("../sort");
const preflop_1 = require("./preflop");
const iso_1 = require("../iso");
// todo option to return as isomorphic (would need to have methods to set board then?)
/**
 * `Range` is a DOM Global so we use `PokerRange`
 *
 * enforces that all combos have the same # of cards
 *
 * accessed by and returns (0-51)[] cards
 *
 * every method that takes cards sorts them in-place
 */
class PokerRange {
    range; //Weighted cardStr dict: {"43,20": 0.63}
    handLen;
    constructor(handLen = 2) {
        this.handLen = handLen;
        this.reset();
    }
    getSize() {
        return this.range.size;
    }
    getHandLen() {
        return this.handLen;
    }
    reset() {
        this.range = new Map();
    }
    getWeight(hand) {
        const str = this.toKey(hand);
        return this.range.get(str) || 0;
    }
    /**
     * setting weight to 0 deletes entirely
     *
     * throws error if hand is different length than hands already in range
     * */
    set(hand, weight = 1) {
        if (hand.length !== this.getHandLen()) {
            if (this.range.size) {
                throw new Error(`attempting to set ${hand.length} len hand in ${this.getHandLen()} len range`);
            }
            else {
                this.handLen = hand.length;
            }
        }
        const str = this.toKey(hand);
        if (!weight) {
            this.range.delete(str);
        }
        else {
            this.range.set(str, weight);
        }
    }
    /** sorts in place */
    toKey(cards) {
        return (0, sort_1.sortCards)(cards).join(',');
    }
    fromKey(str) {
        return str.split(',').map((s) => parseInt(s));
    }
    /** expands preflop categories into their constituent combos */
    static fromPreflop(preflop) {
        const result = new PokerRange(2);
        const weights = preflop.getWeights();
        for (let i = 0; i < weights.length; i++) {
            const weight = weights[i];
            const combos = preflop_1.PreflopRange.handCombos(preflop_1.PreflopRange.fromIdx(i));
            for (const combo of combos) {
                result.set(combo, weight);
            }
        }
        return result;
    }
    /** doesn't modify original */
    static iso(range, suitMap = [-1, -1, -1, -1]) {
        let result = new PokerRange();
        range.forEach((hand, w) => {
            const iso = (0, iso_1.getIsoHand)(hand, suitMap);
            result.set(iso, result.getWeight(iso) + w);
        });
        return result;
    }
    // faster than Symbol iterator
    forEach(f) {
        this.range.forEach((v, k) => {
            f(this.fromKey(k), v);
        });
    }
    map(f) {
        let result = new Array(this.range.size);
        let i = 0;
        this.forEach((hand, weight) => {
            result[i] = f(hand, weight);
            i++;
        });
        return result;
    }
}
exports.PokerRange = PokerRange;
exports.any2 = PokerRange.fromPreflop(preflop_1.any2pre);
const genRandRange = (size) => {
    const range = new PokerRange(2);
    while (range.getSize() < size) {
        range.set((0, utils_1.randUniqueCards)(2));
    }
    return range;
};
exports.genRandRange = genRandRange;
