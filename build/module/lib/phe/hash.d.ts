/**
 * Calculates the quinary hash using the dp table.
 *
 * @name hash_quinary
 * @function
 * @private
 * @param q array with an element for each rank, usually total of 13
 * @param k number of cards that make up the hand, 5, 6 or 7
 * @return hash sum
 */
export declare function hash_quinary(q: number[], k: number): number;
/**
 * Calculates the binary hash using the choose table.
 *
 * @name hash_binary
 * @function
 * @private
 * @param q array with an element for each rank, usually total of 13
 * @param k number of cards that make up the hand, 5, 6 or 7
 * @return hash sum
 */
export declare function hash_binary(q: number[], k: number): number;
