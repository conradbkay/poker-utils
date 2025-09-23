export declare const alpha: (risk: number, reward: number) => number;
export declare const mdf: (risk: number, reward: number) => number;
export declare const weak: (risk: number, reward: number) => number;
export declare const alphaToPot: (alpha: number) => number;
export declare const potToAlpha: (pct: number) => number;
export declare const raiseAlphaToWeak: (alpha: number, faced: number) => number;
export declare const alphaToWeak: (alpha: number) => number;
export declare const bluffEV: (fold: number, alpha: number) => number;
export declare const catchEV: (weak: number, size: number) => number;
/** expects raise/bet in fraction of pot */
export declare const catchEVFromOdds: (weak: number, raise: number, bet: number) => number;
export declare const alphaToRaise: (alpha: number, faced: number) => number;
/**
 * @param value 0-1
 * @param precision how many decimal places should be in the result
 * @returns 0-100
 */
export declare const toPct: (value: number, precision?: number) => number;
