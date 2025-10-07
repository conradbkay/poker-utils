"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flops = exports.flopIsoBoards = exports.allFlops = void 0;
const utils_1 = require("../utils");
const iso_1 = require("../iso");
const utils_2 = require("../cards/utils");
// exported for testing
exports.allFlops = (0, utils_1.genCardCombinations)(3);
exports.flopIsoBoards = Array.from(new Set(exports.allFlops.map((flop) => (0, utils_2.cardsStr)((0, iso_1.canonizeBoard)(flop).cards)))).map(utils_2.fromCardsStr);
// [formatted, cards[], weight]
// takes about 1ms
exports.flops = exports.flopIsoBoards
    .reverse()
    .map((flop) => [(0, utils_2.formatCards)(flop).join(''), flop, (0, iso_1.isoWeight)(flop)]);
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
