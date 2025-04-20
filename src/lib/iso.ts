import { getRank, getSuit, suitCount } from './cards/utils.js'
import { sortCards } from './sort.js'

export const sortBoard = (cards: number[]) => {
  return sortCards(cards, 3) // sort 1st 3 cards only
}

// rank+suit to 1-52 card
export const makeCard = (rank: number, suit: number): number => {
  return (rank - 2) * 4 + suit + 1
}

export const remapCards = (cards: number[], suitMap: number[]) =>
  cards.map((c) => makeCard(getRank(c), suitMap[getSuit(c)]))

/**
 * very fast (~7m flops/s) since loops only rarely execute. Hashing results would actually be slower
 *
 * sorts cards in place if len <= 3
 *
 * todo need a way to undo this operation and get corresponding cards on original board. Likely just return a map
 */
export const canonize = (cards: number[]) => {
  cards = sortBoard(cards)

  const suits = cards.map(getSuit)
  const ranks = cards.map(getRank)

  const suitMap = [-1, -1, -1, -1] // orig to canon(0-3)
  let nextSuit = 3 // 0-indexed, s -> h -> d -> c

  /* for AhAcKc we need to convert to AsAhKs and not AsAhKh. So we have to check for duplicate ranks and swap all siblings to the highest suit */
  for (let i = 0; i < cards.length; i++) {
    const suit = suits[i]
    let siblings = 0 // how many of the same rank is later in hand
    // +2 because siblings at end of cards wouldn't affect anything else as there's no lower ranks left
    while (i + siblings + 2 < cards.length) {
      if (ranks[i + siblings + 1] === ranks[i]) {
        siblings++
      } else {
        break
      }
    }

    for (let j = 1; j <= siblings; j++) {
      let swapped = false // we can't just direct one's children to the others
      const sibSuit = suits[i + j]
      for (let k = j + 1; k < cards.length; k++) {
        if (suits[k] === sibSuit) {
          suits[k] = suit
          cards[k] = makeCard(ranks[i], suits[k])
          swapped = true
        } else if (swapped && suits[k] === suit) {
          suits[k] = sibSuit
          cards[k] = makeCard(ranks[i], suits[k])
        }
      }
    }
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
    cards: isoCards // don't sort here since we don't know if its PLO
  }
}

// wrappers that return sorted isomorphic cards
export const isoHand = (hand: number[]) => sortCards(canonize(hand).cards)
export const isoBoard = (board: number[]) => sortBoard(canonize(board).cards)

/**
 * PioSOLVER format
 */
export const iso = ({ board, hand }: { board?: number[]; hand?: number[] }) => {
  if (!board && !hand) {
    throw new Error('passed neither hand nor board to iso')
  }

  if (!board) {
    return { hand: isoHand(hand) }
  }

  if (!hand) {
    return { board: isoBoard(board) }
  }

  return {
    board: [],
    hand: []
  }
}

/**
 * returns how many strategically similar boards could be created from passed board
 *
 * can pass board pre or post-isomorphism and get same results
 */
export const isoWeight = (board: number[]) => {
  let sc = suitCount(board)
  return [4, 12, 24, 24][sc - 1]
  /* hash logic based on:
  let result = 1
  let suitsLeft = 4
  while (sc > 0) {
    result *= suitsLeft
    sc--
  }
  return result*/
}

const forEachIso = (board: number[], f: (iso: number) => void) => {
  const boardSet = new Set(board)
  const { suitMap, nextSuit } = canonize(board)
  for (let c = 1; c <= 52; c++) {
    if (boardSet.has(c)) continue
    let mappedSuit = suitMap[getSuit(c)]

    const isoCard = makeCard(
      getRank(c),
      mappedSuit === -1 ? nextSuit : mappedSuit
    )

    f(isoCard)
  }
}

export type Runout = { weight: number; map: number[]; children?: Runouts }
export type Runouts = Record<number, Runout>

// depth -1 will run until river reached
export const isoRunouts = (board: number[], weight = 1, depth = -1) => {
  const runouts: Runouts = {} // obj is faster than Map for integer keys (40% speedup)
  forEachIso(board, (c) => {
    runouts[c] ??= { weight: 0, map: [0, 0, 0, 0] }
    runouts[c].weight += weight
  })
  return runouts
}

// nested turn -> river
export const flopIsoRunouts = (flop: number[]) => {
  const isoFlop = canonize(flop).cards
  const runouts = isoRunouts(isoFlop)

  for (const turn in runouts) {
    const weight = runouts[turn].weight
    const tc = parseInt(turn)
    runouts[turn].children = isoRunouts([...isoFlop, tc], weight)
  }

  return runouts
}

// mostly for testing, counts number of nodes if wasn't isomorphic
export const totalIsoWeight = (runouts: Runouts) => {
  const vals = Object.values(runouts)
  let result = 0

  for (const cStr in vals) {
    result += vals[cStr].weight
    if (vals[cStr].children) {
      result += totalIsoWeight(vals[cStr].children)
    }
  }

  return result
}
