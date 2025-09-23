export declare const preflopStrengthOrder: string[];
export declare const handToIsoPre: (hand: number[]) => string;
export declare const isoPre2Combos: Record<string, number[][]>;
/**
 * stores as 13x13 (flattened) "K9s" type hands
 *
 * this class isn't designed to be fast, usually it's converted to a `PokerRange` if doing anything computationally intensive
 */
export declare class PreflopRange {
    private weights;
    constructor();
    getWeights(): number[];
    getWeight(hand: string): number;
    set(hand: string | number, weight?: number): void;
    private reset;
    static toIdx(str: string): any;
    static fromIdx(idx: number): string;
    static handCombos(hand: string): number[][];
    private parseHand;
    /** generate combos in percentile range */
    static fromPercentiles(min: number, max: number): PreflopRange;
    /** must be within this format: "AKs,44:0.75, 32o:.33" */
    static fromStr(str: string): PreflopRange;
    /** returns [0-1, 0-1] generating the closest match using min/max index of `order` */
    toPercentiles(): number[];
    /** piosolver compatible "AA,KK,QQ,JJ:0.9,88:0.825" format */
    toString(): string;
}
export declare const any2pre: PreflopRange;
