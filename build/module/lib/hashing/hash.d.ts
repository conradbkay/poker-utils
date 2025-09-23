import { HoldemRange } from '../range/holdem';
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
export declare const flopEquities: (flop: number[], vsRange: HoldemRange, chopReduction?: "win" | "half" | "skip") => number[][];
export declare const generateEquityHash: (vsRange: HoldemRange) => RiverEquityHash;
export type RiverEquityHash = {
    [board: string]: number[][];
};
export declare const equityFromHash: <T extends RiverEquityHash>(hash: T, flop: number[], hand: number[]) => T[string][number];
