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
exports.flops = exports.flopIsoBoards
    .reverse()
    .map((flop) => [(0, utils_2.formatCards)(flop).join(''), flop, (0, iso_1.isoWeight)(flop)]);
