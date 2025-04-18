export const MAX_PLAYERS = 6

export const CARD_COUNT = 52
export const RANK_COUNT = 13
export const SUIT_COUNT = 4

export const HAND_CATEGORY_OFFSET = 4096 // 0x1000
export const HAND_CATEGORY_SHIFT = 12
export const HIGH_CARD = 1 * HAND_CATEGORY_OFFSET
export const PAIR = 2 * HAND_CATEGORY_OFFSET
export const TWO_PAIR = 3 * HAND_CATEGORY_OFFSET
export const THREE_OF_A_KIND = 4 * HAND_CATEGORY_OFFSET
export const STRAIGHT = 5 * HAND_CATEGORY_OFFSET
export const FLUSH = 6 * HAND_CATEGORY_OFFSET
export const FULL_HOUSE = 7 * HAND_CATEGORY_OFFSET
export const FOUR_OF_A_KIND = 8 * HAND_CATEGORY_OFFSET
export const STRAIGHT_FLUSH = 9 * HAND_CATEGORY_OFFSET

export const CARD_COUNT_SHIFT = 32
export const SUITS_SHIFT = 0b110000 // 48
export const FLUSH_CHECK_MASK64 = 0x8888n << BigInt(SUITS_SHIFT)
export const FLUSH_CHECK_MASK32 = Number(0x8888n << BigInt(SUITS_SHIFT - 32))
//
