# poker-utils

Really fast poker hand evaluation in pure TypeScript

- NLHE and 4-6 card Omaha strength evaluation
- fast isomorphism and weighted isomorphic tree building
- 10x faster board/card sorting
- poker theory math like `alpha`, `bluffEV`, and `catchEV`
- range operations like `combosVsRangeEquity`
- site-specific rake information
- easily generate and access from a hash of every combo on every unique flop

## Quickstart

Use the `evaluate` function to get hand strength information

```js
const pfRange = new PreflopRange()
pfRange.set('66')
pfRange.set('AKs')
pfRange.toString() // "AKs,66"
pfRange.handCombos('22') //
```

use `new PokerRange()` or `PokerRange.fromPreflop(...)`

### Input/Return Format

Percentages are always 0-1 with no rounding

The deck is 1-indexed, ascending from 2c (1) to As (52). Most methods input/output a `number[]`. Use `boardToInts(str): number[]` and `formatCards(number[]): str` for conversion.

`ahead` methods don't compute each runout like the corresponding `equity` methods do

## Benchmarks

V8 is pretty fast, but the fastest algorithms (OMPEval) use SIMD which isn't available

Ran using `mitata` for `poker-utils v12.0.0`

arch: x64-win32
clk: ~5 GHz
Node.js v23.11.0

| Benchmark                                           | Mean       | p99        |
| --------------------------------------------------- | ---------- | ---------- |
| range vs range river equity                         | `352.79µs` | `616.10µs` |
| ...sparser ranges (random 100 combos)               | `56.30µs`  | `181.60µs` |
| Node.js 7 cards .sort                               | `85.48ns`  | `162.28ns` |
| poker-utils 7 cards sortCards()                     | `8.47ns`   | `11.25ns`  |
| full range to isomorphic                            | `680.39µs` | `857.80µs` |
| generate turn+river runouts                         | `40.46µs`  | `139.70µs` |
| flop isomorphism                                    | `90.19ns`  | `117.97ns` |
| phe rand 7 cards                                    | `75.92ns`  | `129.81ns` |
| 2p2 rand 7 cards                                    | `169.06ns` | `223.41ns` |
| 2p2 random 2 cards on fixed river                   | `12.27ns`  | `16.53ns`  |
| 2p2 all combos all runouts after flop (~7.3m evals) | `47.37ms`  | `47.58ms`  |

## Twoplustwo algorithm

By default this package uses a modified version of PHE (<https://github.com/HenryRLee/PokerHandEvaluator>) which returns equivalent values to the 2p2 algorithm, making them interchangeable. It can run on the browser since 5-7 card hashes are ~500 KB combined

The 2p2 algorithm is basically this, where `hr` is an precomputed array of ~32m ints

```py
p = 53
for card in cards
  p = hr[p + card]
return p
```

Poker-Hand-Evaluator (phe) has lookup tables that are much smaller, so even though there's much more computation, it gets better optimized away and 2p2 ends up 2x slower for completely random evaluations

But for random evaluations on the same board, which is the case for the costliest operations (anything involving equity/multiple ranges), you can just store `p`, and now each hand only requires 2 lookups. Additionally, you're using much less of the lookup array resulting in better caching. The `genBoardEval` function implements this and leads to a 15-20x speedup: 83m hands per second on 5 GHz!

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
