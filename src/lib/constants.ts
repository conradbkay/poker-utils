// 23 buckets, spaced by 5% but adding 92.5% and 97.5% to better represent tight range spots
export const equityBuckets = [
  0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
  92.5, 95, 97.5, 100
]
export const SUITS = 'cdhs' as const
export const RANKS = '  23456789TJQKA'

export const DECK = {
  '2c': 1,
  '2d': 2,
  '2h': 3,
  '2s': 4,
  '3c': 5,
  '3d': 6,
  '3h': 7,
  '3s': 8,
  '4c': 9,
  '4d': 10,
  '4h': 11,
  '4s': 12,
  '5c': 13,
  '5d': 14,
  '5h': 15,
  '5s': 16,
  '6c': 17,
  '6d': 18,
  '6h': 19,
  '6s': 20,
  '7c': 21,
  '7d': 22,
  '7h': 23,
  '7s': 24,
  '8c': 25,
  '8d': 26,
  '8h': 27,
  '8s': 28,
  '9c': 29,
  '9d': 30,
  '9h': 31,
  '9s': 32,
  Tc: 33,
  Td: 34,
  Th: 35,
  Ts: 36,
  Jc: 37,
  Jd: 38,
  Jh: 39,
  Js: 40,
  Qc: 41,
  Qd: 42,
  Qh: 43,
  Qs: 44,
  Kc: 45,
  Kd: 46,
  Kh: 47,
  Ks: 48,
  Ac: 49,
  Ad: 50,
  Ah: 51,
  As: 52
} as const

export type Deck = typeof DECK

export const CARDS = Object.values(DECK)

export const c2str = Object.fromEntries(
  Object.entries(DECK).map(([k, v]) => [v, k])
)

// preflop ranges

/** 13x13 flattened */
