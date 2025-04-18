const { dp, choose } = require('./dptables')

// assumes 13 ranks always
const quinary_hash_hash: Record<string, null> = {}

/**
 * Calculates the quinary hash using the dp table.
 *
 * @name hash_quinary
 * @function
 * @private
 * @param {Array} q array with an element for each rank, usually total of 13
 * @param {Number} k number of cards that make up the hand, 5, 6 or 7
 * @return {Number} hash sum
 */
export function hash_quinary(q, k) {
  var sum = 0

  for (var i = 0; i < 13; i++) {
    sum += dp[q[i]][12 - i][k]

    k -= q[i]

    if (k <= 0) break
  }

  return sum
}

/**
 * Calculates the binary hash using the choose table.
 *
 * @name hash_binary
 * @function
 * @private
 * @param {Array} q array with an element for each rank, usually total of 13
 * @param {Number} k number of cards that make up the hand, 5, 6 or 7
 * @return {Number} hash sum
 */
export function hash_binary(q, k) {
  var sum = 0

  for (var i = 0; i < 13; i++) {
    if (q[i]) {
      if (12 - i >= k) {
        sum += choose[12 - i][k]
      }

      k--
      if (k === 0) break
    }
  }

  return sum
}
