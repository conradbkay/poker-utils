import { PreflopRange } from './preflop';
/**
 * `Range` is a DOM Global so we use `PokerRange`
 *
 * enforces that all combos have the same # of cards
 *
 * accessed by and returns (0-51)[] cards
 *
 * every method that takes cards sorts them in-place
 */
export declare class PokerRange {
    private range;
    private handLen;
    constructor(handLen?: number);
    getSize(): number;
    getHandLen(): number;
    reset(): void;
    getWeight(hand: number[]): number;
    /**
     * setting weight to 0 deletes entirely
     *
     * throws error if hand is different length than hands already in range
     * */
    set(hand: number[], weight?: number): void;
    /** sorts in place */
    private toKey;
    private fromKey;
    /** expands preflop categories into their constituent combos */
    static fromPreflop(preflop: PreflopRange): PokerRange;
    /** doesn't modify original */
    static iso(range: PokerRange, suitMap?: number[]): PokerRange;
    forEach(f: (combo: number[], weight: number) => void): void;
    map<T>(f: (combo: number[], weight: number) => T): T[];
}
export declare const any2: PokerRange;
export declare const genRandRange: (size: number) => PokerRange;
