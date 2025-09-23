import { EvaluatedHand } from '../twoplustwo/constants';
export declare const finalP: (p: number) => number;
/**
 * ~1.3x faster than `evaluate`, but just returns `value`
 *
 * doesn't return the correct final values for 5/6 cards, use fastEvalPartial for that
 */
export declare const fastEval: (cards: number[], p?: number) => number;
export declare const fastEvalPartial: (cards: number[], p?: number) => number;
export declare const genOmahaBoardEval: (board: number[]) => (hand: number[]) => number;
export declare const pInfo: (p: number) => {
    handType: number;
    handRank: number;
    p: number;
    value: number;
    handName: "Invalid Hand" | "High Card" | "One Pair" | "Two Pair" | "Three of a Kind" | "Straight" | "Flush" | "Full House" | "Four of a Kind" | "Straight Flush";
};
export declare const twoplustwoEvaluate: (cardValues: number[]) => EvaluatedHand;
