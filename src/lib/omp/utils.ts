export function countTrailingZeros(x: number): number {
  if (x === 0) {
    return 32
  }

  return 31 ^ Math.clz32(x & -x)
}

export function countLeadingZeros(x: number): number {
  // Math.clz32 directly implements this.
  return Math.clz32(x)
}

/**
 * Counts the number of set bits (1s) in a 32-bit integer.
 * Uses standard Hamming weight algorithm.
 * @param x Input number (treated as 32-bit integer).
 * @returns Number of set bits.
 */
export function bitCount32(x: number): number {
  x = x - ((x >> 1) & 0x55555555)
  x = (x & 0x33333333) + ((x >> 2) & 0x33333333)
  x = (x + (x >> 4)) & 0x0f0f0f0f
  x = x + (x >> 8)
  x = x + (x >> 16)
  return x & 0x3f // Max 32 bits
}

/**
 * Counts the number of set bits (1s) in a BigInt.
 * Uses Kernighan's algorithm.
 * @param n Input BigInt. Must be non-negative.
 * @returns Number of set bits.
 */
export function bitCountBigInt(n: bigint): number {
  let count = 0
  while (n > 0n) {
    n = n & (n - 1n) // Clear the least significant bit set
    count++
  }
  return count
}

// Helper for converting negative hex literals from C++ uint32_t
// to positive numbers suitable for JavaScript bitwise operations.
export function uint32(hex: number): number {
  return hex >>> 0
}

export function uint32ToBigInt(val: number): bigint {
  return BigInt(val >>> 0)
}
