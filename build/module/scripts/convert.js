"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../lib/utils");
const path_1 = require("path");
const init_1 = require("../lib/init");
const strength_1 = require("src/lib/twoplustwo/strength");
const allHands = (0, utils_1.genCardCombinations)(5);
(0, init_1.initFromPathSync)((0, path_1.resolve)('./HandRanks.dat'));
let tptNs = new Set();
for (const hand of allHands) {
    const tpt = (0, strength_1.twoplustwoEvaluate)(hand).value;
    tptNs.add(tpt);
}
const sort = Array.from(tptNs).sort((a, b) => a - b);
const gaps = sort
    .filter((n, i) => i !== sort.length - 1 && n !== sort[i + 1] - 1)
    .map((n) => [n + 1, sort[sort.findIndex((compare) => compare > n)] - 1]);
let g = 4096;
const revGapIdxs = gaps.map((c) => {
    g += c[1] + 1 - c[0];
    return [c[0], g];
});
console.log([[0, 4096], ...revGapIdxs]);
