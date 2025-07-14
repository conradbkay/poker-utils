import { getRank, getSuit, makeCard } from './cards/utils'
import { sortCards } from './sort'

/** PioSOLVER format */
export const iso = ({ board, hand }: { board: number[]; hand?: number[] }) => {
  const { suitMap, cards } = canonizeBoard(board)

  return {
    board: cards,
    hand: hand ? getIsoHand(hand, suitMap) : undefined
  }
}

/**
 * very fast (~12.5m flops/s) since loops only rarely execute. Even hashing the results would be slower
 *
 * expects and returns sorted board
 */
export const canonize = (cards: number[], initSuitMap?: number[]) => {
  let suits = cards.map(getSuit)
  let ranks = cards.map(getRank)

  const suitMap = initSuitMap ? [...initSuitMap] : [-1, -1, -1, -1]
  let nextSuit = getNextSuit(suitMap)

  // for AhAcKc and AhAcKh we need to convert both to AsAhKs and not prior to AsAhKh
  // we only need to check the flop because it's the only sortable street
  // we only check first 2 because something like AhKcKh vs AhKhKc sorts to the same board
  if (ranks[0] === ranks[1] && suits[1] === suits[2]) {
    ;[cards[0], cards[1]] = [cards[1], cards[0]]
    suits = [suits[1], suits[0], suits[2]]
    ranks = [ranks[1], ranks[0], ranks[2]]
  }

  for (const suit of suits) {
    if (suitMap[suit] === -1) {
      suitMap[suit] = nextSuit
      nextSuit--
    }
  }

  const isoCards = cards.map((_, i) => makeCard(ranks[i], suitMap[suits[i]]))

  return {
    suitMap,
    nextSuit,
    cards: sortBoard(isoCards)
  }
}

export type Runout = { weight: number; map: number[]; children?: Runouts }
export type Runouts = Record<number, Runout>

/** gets all runouts, set recursive = false to just return the next street */
export const isoRunouts = (
  board: number[],
  weightMult = 1,
  recursive = true
) => {
  const runouts: Runouts = {}

  forEachIso(board, (isoBoard, c, map, weight) => {
    weight *= weightMult
    runouts[c] ??= { weight: 0, map }
    runouts[c].weight += weight

    if (board.length === 3 && recursive) {
      runouts[c].children = isoRunouts([...isoBoard, c], runouts[c].weight)
    }
  })

  return runouts
}

/** returns runouts AFTER applying flop isomorphism */
const forEachIso = (
  board: number[],
  f: (isoBoard: number[], iso: number, map: number[], weight: number) => void
) => {
  const { suitMap, nextSuit, cards } = canonizeBoard(board)
  let boardSet = new Set(cards)

  for (let suit = 3; suit >= nextSuit; suit--) {
    let weight = 1
    if (suit < 0) break
    if (suit === nextSuit) {
      suitMap[suit] = suit
      weight = suit + 1 // if suit is 3, that means it represents 0 1 2 3
    }

    for (let rank = 0; rank < 13; rank++) {
      let c = makeCard(rank, suit)
      if (boardSet.has(c)) continue

      f(cards, c, suitMap, weight)
    }
  }
}

export const sortBoard = (cards: number[]) =>
  sortCards(cards, Math.min(3, cards.length)) // sort 1st 3 cards only

export const canonizeBoard = (board: number[], map?: number[]) =>
  canonize(sortBoard([...board]), map)
export const getIsoHand = (hand: number[], map?: number[]) =>
  sortCards(canonize(sortCards([...hand]), map).cards)

const numSuits = (board: number[]) =>
  new Set(board.map((card) => getSuit(card))).size

const getNextSuit = (suitMap: number[]) => {
  let nextSuit = 3
  for (const suit of suitMap) {
    if (suit !== -1 && suit <= nextSuit) {
      nextSuit = suit - 1
    }
  }
  return nextSuit
}

// mostly for testing, counts number of nodes if wasn't isomorphic
export const totalIsoWeight = (runouts: Runouts) => {
  let result = 0

  for (const c in runouts) {
    result += runouts[c].weight
    if (runouts[c].children) {
      result += totalIsoWeight(runouts[c].children)
    }
  }

  return result
}

/**
 * returns how many strategically similar boards could be created from passed board
 *
 * can pass board pre or post-isomorphism and get same results
 */
export const isoWeight = (board: number[]) => {
  let sc = numSuits(board)
  return [4, 12, 24, 24][sc - 1]
}
