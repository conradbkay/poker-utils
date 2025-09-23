import { PokerRange } from './range';
import { PreflopRange } from './preflop';
/**
 * only for 2 card hands
 *
 * accessed by/from a 0-1325 combo idx
 *
 * all hands always exist in range, just as weight 0
 */
export declare class HoldemRange {
    private range;
    constructor();
    getRange(): number[];
    getWeight(idx: number): number;
    set(idx: number, weight: number): void;
    setHand(hand: number[], weight: number): void;
    /** only iterates on combos with weight > 0 */
    forEachWeighted(f: (weight: number, idx: number) => void): void;
    static fromPokerRange(range: PokerRange): HoldemRange;
    static fromPreflopRange(range: PreflopRange): HoldemRange;
    static getHandIdx(hand: number[]): number;
    static fromHandIdx(idx: number): number[];
    /**
     * Technically this is an O(N log N) algorithm which only does O(N) evaluations (N being the size of the union of range and vsRange) but the sorting step is a lot less than the rest of the algorithm
     *
     * Results get 10x faster after a few sequential calls for smaller ranges, even when completely randomizing the board and both ranges. Full ranges get a 3x speedup
     *
     * @returns [hand, win, tie, lose][], win/tie/lose are the sum of weights in vsRange
     */
    equityVsRange({ board, vsRange }: {
        board: number[];
        vsRange: HoldemRange;
    }): [number[], number, number, number][];
}
export declare const holdemAny2: HoldemRange;
