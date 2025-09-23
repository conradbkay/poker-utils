"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPct = exports.alphaToRaise = exports.catchEVFromOdds = exports.catchEV = exports.bluffEV = exports.alphaToWeak = exports.raiseAlphaToWeak = exports.potToAlpha = exports.alphaToPot = exports.weak = exports.mdf = exports.alpha = void 0;
const alpha = (risk, reward) => {
    return risk / (risk + reward);
};
exports.alpha = alpha;
const mdf = (risk, reward) => {
    return 1 - (0, exports.alpha)(risk, reward);
};
exports.mdf = mdf;
const weak = (risk, reward) => {
    return risk / (risk + risk + reward);
};
exports.weak = weak;
const alphaToPot = (alpha) => {
    return -alpha / (alpha - 1);
};
exports.alphaToPot = alphaToPot;
const potToAlpha = (pct) => {
    return pct / (pct + 1);
};
exports.potToAlpha = potToAlpha;
const raiseAlphaToWeak = (alpha, faced) => {
    const raiseSize = (0, exports.alphaToRaise)(alpha, faced);
    return (raiseSize - faced) / (1 + 2 * raiseSize);
};
exports.raiseAlphaToWeak = raiseAlphaToWeak;
const alphaToWeak = (alpha) => {
    const pct = (0, exports.alphaToPot)(alpha);
    return pct / (pct + pct + 1);
};
exports.alphaToWeak = alphaToWeak;
const bluffEV = (fold, alpha) => {
    const size = (0, exports.alphaToPot)(alpha);
    return fold - (1 - fold) * size;
};
exports.bluffEV = bluffEV;
const catchEV = (weak, size) => {
    return weak * (1 + size) - (1 - weak) * size;
};
exports.catchEV = catchEV;
/** expects raise/bet in fraction of pot */
const catchEVFromOdds = (weak, raise, bet) => {
    const reward = 1 + raise + bet;
    const risk = raise - bet;
    const lose = 1 - weak;
    return weak * reward - lose * risk;
};
exports.catchEVFromOdds = catchEVFromOdds;
const alphaToRaise = (alpha, faced) => {
    return (-1 * alpha * faced - alpha) / (alpha - 1);
};
exports.alphaToRaise = alphaToRaise;
/**
 * @param value 0-1
 * @param precision how many decimal places should be in the result
 * @returns 0-100
 */
const toPct = (value, precision = 1) => {
    const mult = Math.pow(10, precision + 2);
    return (Math.round(value * mult) * 100) / mult;
};
exports.toPct = toPct;
