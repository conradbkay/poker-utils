import { PokerRange } from '../range/range';
export type EquityResult = [win: number, tie: number, lose: number];
export type EvalOptions = {
    board: number[];
    hand: number[];
    chopIsWin?: boolean;
};
export declare const equityEval: ({ board, hand, vsRange, chopIsWin }: EvalOptions & {
    vsRange: PokerRange;
}) => EquityResult[] | EquityResult;
export declare const aheadPct: ({ board, hand }: Omit<EvalOptions, "chopIsWin">, vsRange: PokerRange, evalFunc?: (board: number[], hand: number[]) => number) => EquityResult;
export type RvRArgs = {
    board: number[];
    range: PokerRange;
    vsRange: PokerRange;
    chopIsWin?: boolean;
};
export type ComboEquity = [
    combo: number[],
    equity: EquityResult,
    weight: number
];
/**
 * returns [combo, [wins, losses, ties], weight][]
 */
export declare const combosVsRangeAhead: ({ board, range, vsRange }: RvRArgs) => ComboEquity[];
export declare const rangeVsRangeAhead: (args: RvRArgs) => EquityResult;
export declare const omahaAheadScore: (evalOptions: Omit<EvalOptions, "chopIsWin">, vsRange: PokerRange) => EquityResult;
