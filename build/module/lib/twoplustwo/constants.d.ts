export declare const HAND_TYPES: readonly ["Invalid Hand", "High Card", "One Pair", "Two Pair", "Three of a Kind", "Straight", "Flush", "Full House", "Four of a Kind", "Straight Flush"];
export type HandName = (typeof HAND_TYPES)[number];
export interface EvaluatedHand {
    handType: number;
    handRank: number;
    p: number;
    value: number;
    handName: HandName;
}
