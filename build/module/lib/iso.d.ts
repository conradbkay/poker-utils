/** PioSOLVER format */
export declare const iso: ({ board, hand }: {
    board: number[];
    hand?: number[];
}) => {
    board: number[];
    hand: number[];
};
/**
 * very fast (~12.5m flops/s) since loops only rarely execute. Even hashing the results would be slower
 *
 * expects and returns sorted board
 */
export declare const canonize: (cards: number[], initSuitMap?: number[]) => {
    suitMap: number[];
    nextSuit: number;
    cards: number[];
};
export type Runout = {
    weight: number;
    map: number[];
    children?: Runouts;
};
export type Runouts = Record<number, Runout>;
/** gets all runouts, set recursive = false to just return the next street */
export declare const isoRunouts: (board: number[], weightMult?: number, recursive?: boolean) => Runouts;
export declare const sortBoard: (cards: number[]) => number[];
export declare const canonizeBoard: (board: number[], map?: number[]) => {
    suitMap: number[];
    nextSuit: number;
    cards: number[];
};
export declare const getIsoHand: (hand: number[], map?: number[]) => number[];
export declare const totalIsoWeight: (runouts: Runouts) => number;
/**
 * returns how many strategically similar boards could be created from passed board
 *
 * can pass board pre or post-isomorphism and get same results
 */
export declare const isoWeight: (board: number[]) => number;
