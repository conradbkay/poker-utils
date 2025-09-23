export declare const toPHE: number[];
export declare const fromPHE: any[];
export declare const cardsToPHE: (cards: number[]) => number[];
export declare const cardsFromPHE: (codes: number[]) => any[];
export declare const typeFromPHE: number[];
/**
 * PHE goes from 1 (strongest) to 7462 (weakest)
 * this just reverses that order
 */
export declare const valueFromPHE: (evalN: number) => number;
/**
 * 2p2 eval skips certain ranges since they're used as locations in the lookup table
 */
export declare const removeGaps: (evalN: number) => number;
export declare const addGaps: (pheVal: number) => number;
