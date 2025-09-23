export type CombinationsHash = {
    [cards: number]: {
        [subset: number]: number[][];
    };
};
export declare function combinations<T>(arr: T[], size: number): Generator<T[], void, unknown>;
export declare const hash: CombinationsHash;
