// Hand.ts
import * as C from './constants'
import { countLeadingZeros } from './utils'
import { HandEvaluator } from './handEvaluator' // Forward declaration simulated

// Structure that combines data from multiple cards for efficient evaluation.
export class Hand {
  // Bits 0-63: mKey contains rank combination key (lower 32) and counters (upper 32)
  // Bits 64-127: mMask contains suit masks
  mKey: bigint
  mMask: bigint

  // Static precomputed cards and empty hand. Need initialization.
  public static CARDS: Hand[] = [] // To be filled by initializeStaticData
  public static readonly EMPTY: Hand = Hand.createEmpty()

  // Private constructor for internal use (like EMPTY and CARDS)
  private constructor(key: bigint, mask: bigint) {
    this.mKey = key
    this.mMask = mask
  }

  // Create a Hand from a card index (0-51).
  public static fromCardIndex(cardIdx: number): Hand {
    const cardHand = Hand.CARDS[cardIdx]
    // Return a new instance to prevent mutation of the static cache
    return new Hand(cardHand.mKey, cardHand.mMask)
  }

  // Initialize hand from two card indices.
  public static fromHoleCards(
    holeCardIdx1: number,
    holeCardIdx2: number
  ): Hand {
    const hand1 = Hand.CARDS[holeCardIdx1]
    const hand2 = Hand.CARDS[holeCardIdx2]
    // Combine directly
    return new Hand(hand1.mKey + hand2.mKey, hand1.mMask | hand2.mMask)
  }

  // Combine with another hand, returning a new Hand.
  public add(hand2: Hand): Hand {
    // Assertion: !(mask() & hand2.mask()) - masks should not overlap
    if (Boolean(this.mask() & hand2.mask())) {
      // Use Boolean conversion for 0n check
      console.warn('Adding hands with overlapping cards detected!')
    }

    return new Hand(this.mKey + hand2.mKey, this.mMask | hand2.mMask)
  }

  // Combine with another hand in place (modifies this Hand).
  public addAssign(hand2: Hand): this {
    if (Boolean(this.mask() & hand2.mask())) {
      console.warn('Adding hands with overlapping cards detected!')
    }
    this.mKey += hand2.mKey
    this.mMask |= hand2.mMask
    return this
  }

  // Remove cards from this hand, returning a new Hand.
  public subtract(hand2: Hand): Hand {
    // Assertion: (mask() & hand2.mask()) == hand2.mask() - hand2 must be a subset
    if ((this.mask() & hand2.mask()) !== hand2.mask()) {
      console.warn('Subtracting hand is not a subset!')
      // Depending on strictness, you might throw an error here
    }
    return new Hand(this.mKey - hand2.mKey, this.mMask & ~hand2.mask()) // Use bitwise NOT and AND for mask subtraction
  }

  // Remove cards from this hand in place (modifies this Hand).
  public subtractAssign(hand2: Hand): this {
    if ((this.mask() & hand2.mask()) !== hand2.mask()) {
      console.warn('Subtracting hand is not a subset!')
    }
    this.mKey -= hand2.mKey
    this.mMask &= ~hand2.mask()
    return this
  }

  // Equality comparison.
  public equals(hand2: Hand): boolean {
    return this.mKey === hand2.mKey && this.mMask === hand2.mMask
  }

  // Factory for an empty hand.
  private static createEmpty(): Hand {
    // Initializes suit counters to 3 so that the flush check bits gets set by the 5th suited card.
    // EMPTY(0x3333ull << SUITS_SHIFT, 0)
    const key = 0x3333n << BigInt(C.SUITS_SHIFT)
    const mask = 0n
    return new Hand(key, mask)
  }

  // Number of cards for specific suit.
  public suitCount(suit: number): number {
    if (suit < 0 || suit >= C.SUIT_COUNT) throw new Error('Invalid suit index')
    const shift = BigInt(4 * suit + (C.SUITS_SHIFT - 32))
    const count = Number((this.countersBigInt() >> shift) & 0xfn)
    return count - 3
  }

  // Total number of cards.
  public count(): number {
    // (counters() >> (CARD_COUNT_SHIFT - 32)) & 0xf;
    const shift = BigInt(C.CARD_COUNT_SHIFT - 32)
    // Use >>> for logical shift if counters() could be negative. BigInt >> is arithmetic.
    const cardCount = Number((this.countersBigInt() >> shift) & 0xfn)

    return cardCount
  }

  // Returns true if hand has 5 or more cards of the same suit.
  public hasFlush(): boolean {
    // Hand has a 4-bit counter for each suit. They start at 3 so the 4th bit (0x8) gets set when
    // there are 5 or more cards (3+5=8). Check the high bit of each counter.
    // C++: !!(key() & FLUSH_CHECK_MASK64);
    return Boolean(this.key() & C.FLUSH_CHECK_MASK64)
  }

  // Returns a 32-bit key that is unique for each card rank combination.
  public rankKey(): number {
    // C++: (uint32_t)key(); // Lower 32 bits of mKey
    return Number(this.key() & 0xffffffffn)
  }

  // Returns a card mask (16-bit value, ranks as bits) for the suit that has 5 or more cards.
  // Assumes hasFlush() is true. Result is undefined if no flush exists.
  public flushKey(): number {
    // Get the index of the flush check bit and use it to get the card mask for that suit.
    const countersVal = this.counters() // Get the 32-bit counters value
    const flushCheckBits = countersVal & C.FLUSH_CHECK_MASK32 // Isolate the 4 flush check bits
    if (flushCheckBits === 0) return 0

    const clz = countLeadingZeros(flushCheckBits) // clz is 0-31 (or 32 if input is 0)
    const shiftAmount = BigInt(clz << 2) // Calculate shift for the mask

    // Extract the 16-bit rank mask for the flush suit
    // C++: mMask >> shift
    const rankMask = (this.mask() >> shiftAmount) & 0xffffn // Get lowest 16 bits after shift

    return Number(rankMask)
  }

  // --- Private Helper Methods ---

  // Returns the counters part (upper 32 bits of mKey) as a 32-bit number.
  private counters(): number {
    // C++: key() >> 32;
    // Need logical shift for BigInt potentially. But key() should be positive.
    // Let's use >> and mask to be safe.
    return Number((this.mKey >> 32n) & 0xffffffffn)
  }

  // Returns the counters part as BigInt.
  private countersBigInt(): bigint {
    return this.mKey >> 32n
  }

  // Low 64-bits (Key & counters).
  private key(): bigint {
    return this.mKey
  }

  // High 64-bits (Suit masks).
  private mask(): bigint {
    return this.mMask
  }

  public static _initializeCardConstants(ranks: readonly number[]): void {
    if (Hand.CARDS.length > 0) return // Already initialized

    Hand.CARDS = new Array(C.CARD_COUNT)
    for (let c = 0; c < C.CARD_COUNT; ++c) {
      const rank = Math.floor(c / C.SUIT_COUNT) // 0-12
      const suit = c % C.SUIT_COUNT // 0-3

      // C++: Hand((1ull << (4 * suit + Hand::SUITS_SHIFT)) + (1ull << Hand::CARD_COUNT_SHIFT)
      //           + RANKS[rank], 1ull << ((3 - suit) * 16 + rank));

      const key =
        (1n << BigInt(4 * suit + C.SUITS_SHIFT)) +
        (1n << BigInt(C.CARD_COUNT_SHIFT)) +
        BigInt(ranks[rank])

      const mask = 1n << BigInt((3 - suit) * 16 + rank) // Position for this card in the mask

      Hand.CARDS[c] = new Hand(key, mask)
    }
  }
}
