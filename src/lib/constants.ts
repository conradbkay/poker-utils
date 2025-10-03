// 23 buckets, spaced by 5% but adding 92.5% and 97.5% to better represent tight range spots
export const equityBuckets = [
  0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
  92.5, 95, 97.5, 100
]
export const SUITS = 'cdhs' as const
export const RANKS = '23456789TJQKA' as const

export const DECK = {
  '2c': 0,
  '2d': 1,
  '2h': 2,
  '2s': 3,
  '3c': 4,
  '3d': 5,
  '3h': 6,
  '3s': 7,
  '4c': 8,
  '4d': 9,
  '4h': 10,
  '4s': 11,
  '5c': 12,
  '5d': 13,
  '5h': 14,
  '5s': 15,
  '6c': 16,
  '6d': 17,
  '6h': 18,
  '6s': 19,
  '7c': 20,
  '7d': 21,
  '7h': 22,
  '7s': 23,
  '8c': 24,
  '8d': 25,
  '8h': 26,
  '8s': 27,
  '9c': 28,
  '9d': 29,
  '9h': 30,
  '9s': 31,
  Tc: 32,
  Td: 33,
  Th: 34,
  Ts: 35,
  Jc: 36,
  Jd: 37,
  Jh: 38,
  Js: 39,
  Qc: 40,
  Qd: 41,
  Qh: 42,
  Qs: 43,
  Kc: 44,
  Kd: 45,
  Kh: 46,
  Ks: 47,
  Ac: 48,
  Ad: 49,
  Ah: 50,
  As: 51
} as const

export type Deck = typeof DECK

export const CARDS = Object.values(DECK)

export const c2str = Object.fromEntries(
  Object.entries(DECK).map(([k, v]) => [v, k])
)
