import { EvaluatedHand } from './twoplustwo/constants';
/** exact same input/output as twoplustwo algorithm */
export declare const phe: (cards: number[]) => number;
export declare const evaluate: (cards: number[]) => EvaluatedHand;
export declare const genBoardEval: (board: number[], evalFunc?: (cards: number[], p?: number) => number) => (h: number[]) => number;
export declare const evalOmaha: (board: number[], holeCards: number[]) => EvaluatedHand;
