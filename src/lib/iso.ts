import { getRank, getSuit, suitCount } from './eval/utils'
import { sortCards } from './sort'

// only sorts flop. 2.5x slower than sortCards
export const sortBoard = (cards: number[]) => {
  return sortCards([...cards].slice(0, 3)).concat(cards.slice(3))
}

// rank+suit to 1-52 card
export const makeCard = (rank: number, suit: number): number => {
  return (rank - 2) * 4 + suit + 1
}

// very fast (~7m flops/s) since loops only rarely execute. Hashing results would be slower

/**
 * sorts cards in place if len <= 3
 * */
export const canonize = (cards: number[]) => {
  cards = cards.length <= 3 ? sortCards(cards) : sortBoard(cards)

  const suits = cards.map(getSuit)
  const ranks = cards.map(getRank)

  const suitMap = [-1, -1, -1, -1] // orig to canon(0-3)
  const assignedCanonSuits = new Set<number>()
  let canonSuit = 3 // 0-indexed, s -> h -> d -> c

  /* for AhAcKc we need to convert to AsAhKs and not AsAhKh. So we have to check for duplicate ranks and swap all siblings to the highest suit */
  for (let i = 0; i < cards.length; i++) {
    const suit = suits[i]
    let siblings = 0 // how many of the same rank is later in hand
    // +2 because we siblings at end of cards wouldn't affect anything else as there's no lower ranks left
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

  suits.map((suit, i) => {
    if (suitMap[suit] !== -1) {
      return suitMap[suit]
    }

    // Find the next free canon suit
    while (canonSuit > 0 && assignedCanonSuits.has(canonSuit)) {
      canonSuit--
    }

    suitMap[suit] = canonSuit
    assignedCanonSuits.add(canonSuit)
    return canonSuit
  })

  const isoCards = cards.map((_, i) => makeCard(ranks[i], suitMap[suits[i]]))

  return {
    suitMap,
    nextSuit: canonSuit,
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
