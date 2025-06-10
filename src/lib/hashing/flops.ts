import { genCardCombinations } from '../utils.js'
import { canonizeBoard, isoWeight } from '../iso.js'
import { cardsStr, formatCards, fromCardsStr } from '../cards/utils.js'

// exported for testing
export const allFlops = genCardCombinations(3)

export const flopIsoBoards = Array.from(
  new Set(allFlops.map((flop) => cardsStr(canonizeBoard(flop).cards)))
).map(fromCardsStr)

// [formatted, cards[], weight]
export const flops = flopIsoBoards
  .reverse()
  .map(
    (flop) =>
      [formatCards(flop).join(''), flop, isoWeight(flop)] as [
        string,
        number[],
        number
      ]
  )
