# poker-utils

Really fast poker hand evaluation in pure TypeScript

- NLHE and 4-6 card Omaha strength evaluation
- fast isomorphism and weighted isomorphic tree building
- 10x faster board/card sorting
- poker theory math like `alpha`, `bluffEV`, and `catchEV`
- range operations like `combosVsRangeEquity`
- site-specific rake information
- easily generate and access from a hash of every combo on every unique flop

_Update:_ if really fast isn't fast enough, check out <https://github.com/conradbkay/poker-wasm> for NLHE range vs range equity calculations

## Quickstart

```js
import { PreflopRange, boardToInts, evaluate, iso } from 'poker-utils'

const preRange = new PreflopRange()
preRange.set('66')
preRange.set('AKs', 0.5)
preRange.toString() // "AKs:0.5,66"
preRange.getWeight('AKs') // 0.5

const { board, hand } = iso({
  board: boardToInts('Kh9c4s3c5h'),
  hand: boardToInts('3d3s')
})
console.log(formatCards(board)) // [ 'Ks', '9h', '4d', '3h', '5s' ]
console.log(formatCards(hand)) // [ '3d', '3c' ]

const evaluated = evaluate([...board, ...hand])

console.log(evaluated) /*{
  handType: 4,
  handRank: 118,
  p: 16502,
  value: 5113,
  handName: 'Three of a Kind'
}*/
```

use `new PokerRange()` or `PokerRange.fromPreflop(...)`

### Input/Return Format

Percentages are always 0-1 with no rounding

The deck is 0-indexed, ascending from 2c (0) to As (51). Most methods input/output a `number[]`. Use `boardToInts(str): number[]` and `formatCards(number[]): str` for conversion.

`ahead` methods don't compute each runout like the corresponding `equity` methods do

## Benchmarks

V8 is pretty fast, but the fastest algorithms (OMPEval) use SIMD which isn't available

Ran using `mitata` for `poker-utils v13.1.7`

clk: ~5.07 GHz
cpu: Intel(R) Core(TM) i5-14600K
runtime: node

arch: x64-linux
clk: ~5 GHz
Node.js v22.17.0

| Benchmark                                           | Mean       | p99        |
| --------------------------------------------------- | ---------- | ---------- |
| 2p2 range vs range river equity                     | `318.16µs` | `507.69µs` |
| ...sparser ranges (random 100 combos)               | `56.05µs`  | `151.04µs` |
| Node.js 7 cards .sort                               | `110.31ns` | `186.67ns` |
| poker-utils 7 cards sortCards()                     | `8.18ns`   | `10.22ns`  |
| full range to isomorphic                            | `665.45µs` | `934.23µs` |
| generate turn+river runouts                         | `57.49µs`  | `156.86µs` |
| flop isomorphism                                    | `140.81ns` | `183.92ns` |
| phe rand 7 cards                                    | `141.41ns` | `170.25ns` |
| 2p2 rand 7 cards                                    | `86.71ns`  | `133.12ns` |
| 2p2 random 2 cards on fixed river                   | `11.30ns`  | `13.03ns`  |
| 2p2 all combos all runouts after flop (~7.3m evals) | `53.93ms`  | `54.26ms`  |
| 2p2 turn equity vs range                            | `12.48ms`  | `12.99ms`  |

## Twoplustwo algorithm

By default this package uses a modified version of PHE (<https://github.com/HenryRLee/PokerHandEvaluator>) which returns equivalent values to the 2p2 algorithm, making them interchangeable. It can run on the browser since 5-7 card hashes are ~500 KB combined

The 2p2 algorithm is basically this, where `hr` is an precomputed array of ~32m ints

```py
p = 53
for card in cards
  p = hr[p + card]
return p
```

Poker-Hand-Evaluator (phe) has lookup tables that are much smaller, so even though there's much more computation, it gets better optimized away and ends up similar to using 2p2 for performance

But for random evaluations on the same board, which is the case for the costliest operations (anything involving equity/multiple ranges), you can just store `p`, and now each hand only requires 2 lookups. Additionally, you're using much less of the lookup array resulting in better caching. The `genBoardEval` function implements this and leads to a 10-20x speedup: 91m random 7 card hands per second on 5 GHz

To load `hr`, which you can download here <https://github.com/chenosaurus/poker-evaluator/blob/master/data/HandRanks.dat> call `initFromPath`/`initFromPathSync`, or `init` if you already have the file loaded

## Explanation

### Isomorphism

Maps original suits to new suits such that all strategically identical boards turn into the same board. This implementation matches PioSOLVER which sorts flop descending by rank and assigns suits descending alphabetically (s -> h -> d -> c)

For example, all monotone flops become 3 spades (Kh7h3h -> Ks7s3s)

## Changelog

### 12.0

- **Breaking** Equity/ahead methods now return an array `[lose, tie, win]`, or `[combo, lose, tie, win][]` if evaluating a range
- Added `equityVsRange` to `HoldemRange` which is 10-200x faster
- Deck now goes from 0-51, and ranks from 0-12

## Roadmap

- representing omaha ranges well (AKQ9ss type)
- CLI commands for hash generation
- bucketing, or other ways to trade precision for speed
- Monte carlo is necessary for many preflop and 3+ players spots, and maybe for PLO flops
- webassembly OMPEval <https://github.com/emscripten-core/emscripten> <https://emscripten.org/docs/porting/simd.html>
