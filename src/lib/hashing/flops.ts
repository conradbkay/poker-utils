import { genCardCombinations } from '../utils'
import { canonizeBoard, isoWeight } from '../iso'
import {
  cardsStr,
  formatCards,
  fromCardsStr
  /*getRank,
  makeCard,
  oesdPossible*/
} from '../cards/utils'

// exported for testing
export const allFlops = genCardCombinations(3)

export const flopIsoBoards = Array.from(
  new Set(allFlops.map((flop) => cardsStr(canonizeBoard(flop).cards)))
).map(fromCardsStr)

// [formatted, cards[], weight]
// takes about 1ms
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

/*
this is by far the fastest way to check if a flop is an OESD

place the results in ../cards/utils to avoid circular dependency

const nonOesdRanks = Array.from(
  new Set(
    flops
      .map(([, cards]) => cards.map(getRank))
      .filter((ranks) => !oesdPossible(ranks.map((r) => makeCard(r, 1))))
      .map((ranks) =>
        Array.from(new Set(ranks))
          .sort((a, b) => a - b)
          .join(',')
      )
  )
)

console.log(JSON.stringify(nonOesdRanks))
*/
