// HandEvaluator.ts
import * as C from './constants'
import { Hand } from './hand'
import { PERF_HASH_ROW_OFFSETS } from './offsetTable'
import { bitCount32, bitCountBigInt } from './utils'

export class HandEvaluator {
  // Rank multipliers for non-flush and flush hands.
  // Copied from HandEvaluator.cpp
  private static readonly RANKS: readonly number[] = [
    0x2000, 0x8001, 0x11000, 0x3a000, 0x91000, 0x176005, 0x366000, 0x41a013,
    0x47802e, 0x479068, 0x48c0e4, 0x48f211, 0x494493
  ]

  private static readonly FLUSH_RANKS: readonly number[] = [
    1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096
  ] // Powers of 2

  // Perfect hash constants
  private static readonly PERF_HASH_ROW_SHIFT = 12
  // private static readonly PERF_HASH_COLUMN_MASK = (1 << HandEvaluator.PERF_HASH_ROW_SHIFT) - 1; // Not directly used in evaluate

  // Minimum cards (can affect table generation if changed, requires recalculation)
  private static readonly MIN_CARDS = 0 // Keep as in C++

  // Lookup tables - sizes based on C++ implementation
  // Max key calculation: 4 * RANKS[12] + 3 * RANKS[11]
  // Max key = 4 * 0x494493 + 3 * 0x48f211 = 1834980 + 1438851 = 3273831 approx (fits in number)
  private static readonly MAX_KEY =
    4 * HandEvaluator.RANKS[12] + 3 * HandEvaluator.RANKS[11]

  // Size based on C++ comment (86547). This implies the max index from perfHash(key).
  private static readonly LOOKUP_TABLE_SIZE = 86547
  private static readonly FLUSH_LOOKUP_SIZE = 8192 // 2^13, enough for 13 ranks mask

  private static LOOKUP: Uint16Array = new Uint16Array(0) // To be sized and filled
  private static FLUSH_LOOKUP: Uint16Array = new Uint16Array(0) // To be sized and filled

  private static isInitialized = false

  // Constructor simply ensures static initialization happens once.
  constructor() {
    HandEvaluator.initializeStaticData()
  }

  /**
   * Evaluates a Hand object.
   * @param hand The hand to evaluate (contains 0 to 7 cards).
   * @param flushPossible Optimization: set to false if a flush is impossible (e.g., board has no 3 suited cards).
   * @returns A 16-bit number representing the hand rank. Higher is better.
   *          Category can be extracted via rank >> C.HAND_CATEGORY_SHIFT.
   */
  public evaluate(hand: Hand, flushPossible: boolean = true): number {
    if (flushPossible && hand.hasFlush()) {
      return HandEvaluator.FLUSH_LOOKUP[hand.flushKey()]
    } else {
      const rankKey = hand.rankKey() // 32-bit key based on rank counts
      const hash = HandEvaluator.perfHash(rankKey)
      if (hash < 0 || hash >= HandEvaluator.LOOKUP_TABLE_SIZE) {
        console.error(`Hash index out of bounds: key=${rankKey}, hash=${hash}`)
        // This often happens if PERF_HASH_ROW_OFFSETS is incomplete or incorrect
        return 0 // Error case
      }
      return HandEvaluator.LOOKUP[hash]
    }
  }

  /**
   * Perfect Hashing function.
   * @param key The 32-bit rank key.
   * @returns Index into the LOOKUP table.
   */
  private static perfHash(key: number): number {
    // Ensure key is treated as unsigned for the shift
    const rowIndex = key >>> HandEvaluator.PERF_HASH_ROW_SHIFT
    if (rowIndex >= PERF_HASH_ROW_OFFSETS.length) {
      console.error(
        `perfHash row index out of bounds: key=${key}, rowIndex=${rowIndex}`
      )
      return -1 // Indicate error
    }
    const offset = PERF_HASH_ROW_OFFSETS[rowIndex]
    // Use standard JS addition (results in number).
    // The C++ code implies the result fits the LOOKUP index range.
    // Need to ensure the result is non-negative.
    const hashIndex = key + offset
    return hashIndex | 0 // Ensure 32-bit signed behavior
  }

  // --- Static Initialization ---

  /**
   * Initializes all static data including lookup tables and Hand constants.
   * MUST be called once before using the evaluator or creating Hand instances.
   */
  public static initializeStaticData(): void {
    if (HandEvaluator.isInitialized) {
      return
    }
    console.time('Initialize static data')

    // 1. Initialize Hand.CARDS (depends on HandEvaluator.RANKS)
    Hand._initializeCardConstants(HandEvaluator.RANKS)

    // 2. Allocate lookup tables
    HandEvaluator.LOOKUP = new Uint16Array(HandEvaluator.LOOKUP_TABLE_SIZE)
    HandEvaluator.FLUSH_LOOKUP = new Uint16Array(
      HandEvaluator.FLUSH_LOOKUP_SIZE
    )

    // 3. Populate tables using the recursive helper
    const RC = C.RANK_COUNT
    let handValue: number

    // Category 1: High card
    handValue = C.HIGH_CARD
    handValue = HandEvaluator.populateLookup(0n, 0, handValue, RC, 0, 0, 0)

    // Category 2: Pair
    handValue = C.PAIR
    for (let r = 0; r < RC; ++r) {
      handValue = HandEvaluator.populateLookup(
        2n << BigInt(4 * r),
        2,
        handValue,
        RC,
        0,
        0,
        0
      )
    }

    // Category 3: Two pairs
    handValue = C.TWO_PAIR
    for (let r1 = 0; r1 < RC; ++r1) {
      for (let r2 = 0; r2 < r1; ++r2) {
        const ranks = (2n << BigInt(4 * r1)) + (2n << BigInt(4 * r2))
        handValue = HandEvaluator.populateLookup(
          ranks,
          4,
          handValue,
          RC,
          r2,
          0,
          0
        )
      }
    }

    // Category 4: Three of a kind
    handValue = C.THREE_OF_A_KIND
    for (let r = 0; r < RC; ++r) {
      handValue = HandEvaluator.populateLookup(
        3n << BigInt(4 * r),
        3,
        handValue,
        RC,
        0,
        r,
        0
      )
    }

    // Category 5: Straight
    handValue = C.STRAIGHT
    const wheelRanks = 0x1000000001111n // A, 5, 4, 3, 2 -> Ranks 12, 3, 2, 1, 0
    handValue = HandEvaluator.populateLookup(
      wheelRanks,
      5,
      handValue,
      RC,
      RC,
      RC,
      3
    ) // Ace-low (max card rank 3 = '5')
    for (let r = 4; r < RC; ++r) {
      // 6-high up to Ace-high
      // Ranks: r, r-1, r-2, r-3, r-4
      const straightRanks = 0x11111n << BigInt(4 * (r - 4))
      handValue = HandEvaluator.populateLookup(
        straightRanks,
        5,
        handValue,
        RC,
        RC,
        RC,
        r
      )
    }

    // Category 6: Flush (uses different keying)
    handValue = C.FLUSH
    handValue = HandEvaluator.populateLookup(
      0n,
      0,
      handValue,
      RC,
      0,
      0,
      0,
      true
    )

    // Category 7: Full house
    handValue = C.FULL_HOUSE
    for (let r1 = 0; r1 < RC; ++r1) {
      for (let r2 = 0; r2 < RC; ++r2) {
        if (r1 !== r2) {
          const ranks = (3n << BigInt(4 * r1)) + (2n << BigInt(4 * r2))
          handValue = HandEvaluator.populateLookup(
            ranks,
            5,
            handValue,
            RC,
            r2,
            r1,
            RC
          )
        }
      }
    }

    // Category 8: Four of a kind
    handValue = C.FOUR_OF_A_KIND
    for (let r = 0; r < RC; ++r) {
      handValue = HandEvaluator.populateLookup(
        4n << BigInt(4 * r),
        4,
        handValue,
        RC,
        RC,
        RC,
        RC
      )
    }

    // Category 9: Straight flush
    handValue = C.STRAIGHT_FLUSH
    // wheel (A-5 straight flush)
    handValue = HandEvaluator.populateLookup(
      wheelRanks,
      5,
      handValue,
      RC,
      0,
      0,
      3,
      true
    )
    for (let r = 4; r < RC; ++r) {
      // 6-high up to Ace-high
      const straightRanks = 0x11111n << BigInt(4 * (r - 4))
      handValue = HandEvaluator.populateLookup(
        straightRanks,
        5,
        handValue,
        RC,
        0,
        0,
        r,
        true
      )
    }

    HandEvaluator.isInitialized = true
    console.timeEnd('Initialize static data')
  }
  /**
   * Recursive helper to populate lookup tables.
   * @param ranks bigint representing rank counts (4 bits per rank)
   * @param ncards current number of cards in the combination being built
   * @param handValue current hand rank value to assign
   * @param endRank highest rank allowed for the *next* card to add (used for ordered combinations)
   * @param maxPair rank boundary for pairs (prevents upgrading category accidentally)
   * @param maxTrips rank boundary for trips
   * @param maxStraight rank boundary for straights
   * @param flush Is this for the flush lookup table?
   * @returns The next handValue to use
   */
  private static populateLookup(
    ranks: bigint,
    ncards: number,
    handValue: number,
    endRank: number,
    maxPair: number,
    maxTrips: number,
    maxStraight: number,
    flush: boolean = false
  ): number {
    // Increment value *before* writing if it's a valid rankable hand size (>= MIN_CARDS and <= 5)
    if (
      ncards <= 5 &&
      ncards >= (HandEvaluator.MIN_CARDS < 5 ? HandEvaluator.MIN_CARDS : 5)
    ) {
      handValue++
    }

    if (ncards >= HandEvaluator.MIN_CARDS || (flush && ncards >= 5)) {
      const key = HandEvaluator.getKey(ranks, flush)

      if (flush) {
        HandEvaluator.FLUSH_LOOKUP[key] = handValue
        /*
        Hallucination? Delete
        if (key < 0 || key >= HandEvaluator.FLUSH_LOOKUP_SIZE) {
          console.error(
            `Flush key out of bounds during population: key=${key}, ranks=${ranks}`
          )
        } else if (HandEvaluator.FLUSH_LOOKUP[key] === 0) {
          // Write only once
          HandEvaluator.FLUSH_LOOKUP[key] = handValue
        }*/
      } else {
        const hash = HandEvaluator.perfHash(key)
        if (hash < 0 || hash >= HandEvaluator.LOOKUP_TABLE_SIZE) {
          console.error(
            `Hash index out of bounds during population: key=${key}, hash=${hash}, ranks=${ranks}`
          )
        } else {
          if (
            HandEvaluator.LOOKUP[hash] !== 0 &&
            HandEvaluator.LOOKUP[hash] !== handValue
          ) {
            console.error(
              'Setting',
              HandEvaluator.LOOKUP[hash],
              'to',
              handValue,
              'key',
              key,
              'hash',
              hash
            )
          }
          HandEvaluator.LOOKUP[hash] = handValue
        }
      }

      // stop recursion
      if (ncards === 7) return handValue
    }

    // basically a direct copy from the c++ code with BigInt added
    // Iterate adding the next card rank.
    // Add cards with ranks from 0 up to (but not including) endRank.
    for (let r = 0; r < endRank; ++r) {
      const shift = BigInt(r) * 4n
      const newRanks = ranks + (1n << shift)
      const rankCount = (newRanks >> shift) & 0xfn
      if (rankCount == 2n && r >= maxPair) continue
      if (rankCount == 3n && r >= maxTrips) continue
      if (rankCount >= 4n)
        // Don't allow new quads or more than 4 of same rank.
        continue

      if (HandEvaluator.getBiggestStraight(newRanks) > maxStraight) continue

      handValue = HandEvaluator.populateLookup(
        newRanks,
        ncards + 1,
        handValue,
        r + 1,
        maxPair,
        maxTrips,
        maxStraight,
        flush
      )
    }

    return handValue
  }

  /**
   * Calculates the lookup key (either 32-bit rank key or 16-bit flush key)
   * from the rank count bigint.
   */
  private static getKey(ranks: bigint, flush: boolean): number {
    let key = 0
    const rankValues = flush ? HandEvaluator.FLUSH_RANKS : HandEvaluator.RANKS
    for (let r = 0; r < C.RANK_COUNT; ++r) {
      const count = Number((ranks >> BigInt(r * 4)) & 0xfn)
      if (count > 0) {
        key += count * rankValues[r]
      }
    }
    // Flush key must fit in 16 bits for FLUSH_LOOKUP index.
    // Non-flush key uses 32 bits.
    // The FLUSH_RANKS ensure the flush key is just a bitmask of ranks present (max 8191).
    // The non-flush RANKS generate a larger unique key.
    return key
  }

  /**
   * Finds the highest card rank of the best 5-card straight in the given ranks.
   * Returns rank index (0-12), or a value < 3 if no straight is present.
   * (Ace is rank 12, Five is rank 3 for wheel straight A5432)
   */
  private static getBiggestStraight(ranks: bigint): number {
    // Create a bitmask where bit `r` is set if rank `r` is present at least once.
    let rankMask = 0
    for (let r = 0; r < C.RANK_COUNT; ++r) {
      if ((ranks >> BigInt(r * 4)) & 0xfn) {
        // Check if count > 0
        rankMask |= 1 << r
      }
    }

    // Check for standard straights (AKQJT down to 65432)
    // Mask for 5 consecutive bits: 0b11111 = 0x1F
    for (let r = C.RANK_COUNT - 1; r >= 4; --r) {
      // Check starting from rank 'r' down to 'r-4'
      const straightMask = 0x1f << (r - 4)
      if ((rankMask & straightMask) === straightMask) {
        return r // Highest card rank in the straight
      }
    }

    // Check for wheel (A5432) -> ranks 12, 3, 2, 1, 0
    const wheelMask = (1 << 12) | (1 << 3) | (1 << 2) | (1 << 1) | (1 << 0) // 0x100F
    if ((rankMask & wheelMask) === wheelMask) {
      return 3 // Highest card is '5' (rank 3) for ranking purposes
    }

    return 0 // No straight found (or rather, highest card rank is < 3)
  }
}
