/**
 * Sorting was the bottleneck for a lot of operations using native .sort
 *
 * Sorts an array of unique integers descending in place using optimal sorting networks for length up to 11 (for PLO6+board), and normal .sort after that
 *
 * @param {number[]} arr The array to sort (will be modified in place).
 */
export declare const sortCards: (arr: number[], n?: number) => number[];
