"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.holdemAny2 = exports.HoldemRange = void 0;
const range_1 = require("./range");
const sort_1 = require("../sort");
const evaluate_1 = require("../evaluate");
const preflop_1 = require("./preflop");
/**
 * only for 2 card hands
 *
 * accessed by/from a 0-1325 combo idx
 *
 * all hands always exist in range, just as weight 0
 */
class HoldemRange {
    range; // weighted
    constructor() {
        this.range = new Array(1326).fill(0); // fairly trivial allocation, but could use a sparse array instead
    }
    getRange() {
        return this.range;
    }
    getWeight(idx) {
        return this.range[idx];
    }
    set(idx, weight) {
        this.range[idx] = weight;
    }
    setHand(hand, weight) {
        if (HoldemRange.getHandIdx(hand) >= 1326) {
            console.error(hand, HoldemRange.getHandIdx(hand));
            throw new Error('invalid hand');
        }
        this.set(HoldemRange.getHandIdx(hand), weight);
    }
    /** only iterates on combos with weight > 0 */
    forEachWeighted(f) {
        for (let i = 0; i < this.range.length; i++) {
            if (this.range[i])
                f(this.range[i], i);
        }
    }
    static fromPokerRange(range) {
        const result = new HoldemRange();
        range.forEach((hand, weight) => {
            result.setHand(hand, weight);
        });
        return result;
    }
    static fromPreflopRange(range) {
        return HoldemRange.fromPokerRange(range_1.PokerRange.fromPreflop(range));
    }
    static getHandIdx(hand) {
        (0, sort_1.sortCards)(hand);
        return (hand[0] * (hand[0] - 1)) / 2 + hand[1];
    }
    static fromHandIdx(idx) {
        return idx2hand[idx];
    }
    /*
    C(52, 2) means there are 1326 unique NLHE combos, and we can do basic map to convert each hand (two ints) to 0-1325 which we'll call comboIdx
  
    From both ranges, we create a combined array `allCombos` of tuples [strength, comboIdx, vsWeight, combo, weight]
  
    we sort that by strength, then store the prefix sum for vsWeight in `prefix`
  
    now we can create a lookup such that every comboIdx maps to an index range ([min, max]) in `allCombos` based on its hand strength
  
    that means that for any combo, we can simply use the lookup to get the weight sum of all combos we beat via `prefix[min - 1]`, the sum of ties via `prefix[max] - prefix[min]`, and the sum of losses via `totalWeight - win - tie`
  
    but each combo removes 2 different cards from the deck, meaning it can only be up against one of C(50, 2) = 1225 combos, or rather it blocks 101 combos which we need to account for
  
    Another way to think about it is that each of its cards blocks 51 combos, and they both block a shared combo (AcQc would block AcQc twice)
  
    For each card in the deck, we can create another prefix sum for vsWeight, but this one will skip any combo that doesn't share a card/get blocked by it
  
    To get the final result for every combo in our range, we get the naive sums (win tie lose), but subtract the blocker prefix sums for both cards using the same logic, then simply undo the double blocked (equivalent) combo
    */
    /**
     * Technically this is an O(N log N) algorithm which only does O(N) evaluations (N being the size of the union of range and vsRange) but the sorting step is a lot less than the rest of the algorithm
     *
     * Results get 10x faster after a few sequential calls for smaller ranges, even when completely randomizing the board and both ranges. Full ranges get a 3x speedup
     *
     * @returns [hand, win, tie, lose][], win/tie/lose are the sum of weights in vsRange
     */
    equityVsRange({ board, vsRange }) {
        const boardEval = (0, evaluate_1.genBoardEval)(board);
        const boardMask = new Array(52).fill(false);
        for (const card of board) {
            boardMask[card] = true;
        }
        const allCombos = [];
        vsRange.forEachWeighted((weight, idx) => {
            const combo = HoldemRange.fromHandIdx(idx);
            if (boardMask[combo[0]] || boardMask[combo[1]]) {
                return;
            }
            allCombos.push([
                boardEval(combo),
                HoldemRange.getHandIdx(combo),
                weight,
                combo,
                0
            ]);
        });
        const insertMap = new Array(1326); // handIdx to idx in allCombos
        for (let i = 0; i < allCombos.length; i++) {
            insertMap[allCombos[i][1]] = i;
        }
        this.forEachWeighted((weight, idx) => {
            const combo = HoldemRange.fromHandIdx(idx);
            if (boardMask[combo[0]] || boardMask[combo[1]]) {
                return;
            }
            const handIdx = HoldemRange.getHandIdx(combo);
            if (insertMap[handIdx] !== undefined) {
                allCombos[insertMap[handIdx]][4] = weight;
            }
            else {
                allCombos.push([boardEval(combo), handIdx, 0, combo, weight]);
            }
        });
        allCombos.sort((a, b) => a[0] - b[0]); // strength ascending
        let totalWeight = 0;
        let weightPrefix = new Array(allCombos.length);
        let curP = -1;
        let curPIdxRange = [0, 0];
        let idxToRange = new Array(allCombos.length);
        let idxToSorted = new Array(allCombos.length);
        for (let i = 0; i < allCombos.length; i++) {
            const [p, idx, weight] = allCombos[i];
            totalWeight += weight;
            weightPrefix[i] = totalWeight;
            if (p !== curP) {
                curP = p;
                curPIdxRange = [i, i];
            }
            else {
                curPIdxRange[1] = i;
            }
            idxToRange[idx] = curPIdxRange; // pointer
            idxToSorted[idx] = i;
        }
        const blockedPrefix = new Array(52);
        for (let card = 0; card < 52; card++) {
            let cumBlockedWeight = 0;
            blockedPrefix[card] = new Array(allCombos.length);
            for (let i = 0; i < allCombos.length; i++) {
                const combo = allCombos[i][3];
                // significantly faster than .includes()
                if (combo[0] === card || combo[1] === card) {
                    cumBlockedWeight += allCombos[i][2];
                }
                blockedPrefix[card][i] = cumBlockedWeight;
            }
        }
        // todo seems like each handIdx is getting called twice?
        let result = [];
        this.forEachWeighted((_, idx) => {
            const combo = HoldemRange.fromHandIdx(idx);
            if (boardMask[combo[0]] || boardMask[combo[1]]) {
                return null;
            }
            const handIdx = HoldemRange.getHandIdx(combo);
            const idxRange = idxToRange[handIdx];
            const directIdx = idxToSorted[handIdx];
            let beatWeight = idxRange[0] > 0 ? weightPrefix[idxRange[0] - 1] : 0;
            let tieWeight = weightPrefix[idxRange[1]] - beatWeight;
            let afterBlockerWeight = totalWeight;
            for (const card of combo) {
                const blockedWeight = blockedPrefix[card][allCombos.length - 1];
                const blockedBeatWeight = idxRange[0]
                    ? blockedPrefix[card][idxRange[0] - 1]
                    : 0;
                const blockedTieWeight = blockedPrefix[card][idxRange[1]] -
                    (idxRange[0] > 0 ? blockedPrefix[card][idxRange[0] - 1] : 0);
                afterBlockerWeight -= blockedWeight;
                beatWeight -= blockedBeatWeight;
                tieWeight -= blockedTieWeight;
            }
            // undo double blocking the equal combo, which is always a tie
            const doubleBlockedWeight = allCombos[directIdx][2];
            afterBlockerWeight += doubleBlockedWeight;
            tieWeight += doubleBlockedWeight;
            const loseWeight = afterBlockerWeight - beatWeight - tieWeight;
            result.push([combo, beatWeight, tieWeight, loseWeight]);
        });
        return result;
    }
}
exports.HoldemRange = HoldemRange;
const idx2hand = new Array(1326);
// 0.2ms
for (let a = 51; a >= 1; a--) {
    for (let b = a - 1; b >= 0; b--) {
        const hand = [a, b];
        idx2hand[HoldemRange.getHandIdx(hand)] = hand;
    }
}
exports.holdemAny2 = HoldemRange.fromPreflopRange(preflop_1.any2pre);
