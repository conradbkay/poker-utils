# poker-utils

Really fast poker hand evaluation in pure TypeScript

- NLHE and 4-6 card Omaha strength evaluation
- fast isomorphism and weighted isomorphic tree building
- 10x faster board/card sorting
- poker theory math like `alpha`, `bluffEV`, and `catchEV`
- range operations (`combosVsRangeEquity`)
- easily generate and access from a hash of every combo on every unique flop
- site-specific rake information

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

The deck is 1-indexed, ascending from 2c (1) to As (52). Most methods input/output a `number[]`. Use `boardToInts(str): number[]` and `formatCards(number[]): str` for conversion

`ahead` methods don't look at each runout like the corresponding `equity` methods do

## Benchmarks

V8 is pretty fast, but the fastest algorithms (OMPEval) use SIMD which isn't available

Ran using `mitata` for `poker-utils v11.1.8`

arch: x64-win32
clk: ~5 GHz
Node.js v23.11.0

| Benchmark                              | Mean       | p99        |
| -------------------------------------- | ---------- | ---------- |
| Node.js 7 cards .sort                  | `88.66ns`  | `167.14ns` |
| poker-utils 7 cards sortCards()        | `8.70ns`   | `15.72ns`  |
| range to isomorphic                    | `744.74µs` | `1.01ms`   |
| generate river runouts                 | `1.56µs`   | `1.66µs`   |
| generate turn+river runouts            | `57.63µs`  | `59.75µs`  |
| flop isomorphism                       | `140.44ns` | `198.61ns` |
| river isomorphism                      | `223.49ns` | `290.09ns` |
| cardsToPHE                             | `16.98ns`  | `43.87ns`  |
| PHE bit range RvR equity               | `66.07µs`  | `232.00µs` |
| ...with handBlockers                   | `12.03ms`  | `13.32ms`  |
| phe sequential+convert                 | `70.21ns`  | `115.23ns` |
| 2p2 sequential                         | `24.26ns`  | `35.57ns`  |
| phe rand 7 cards                       | `71.89ns`  | `118.73ns` |
| 2p2 rand 7 cards                       | `173.30ns` | `265.99ns` |
| ...with 5-6 card conditional handling  | `178.99ns` | `269.46ns` |
| ...with pInfo overhead                 | `208.75ns` | `316.28ns` |
| 2p2 random 2 cards on fixed river      | `12.54ns`  | `21.17ns`  |
| 2p2 random 2 cards on fixed flop       | `16.99ns`  | `28.61ns`  |
| 2p2 river full range vs range equity   | `15.45ms`  | `16.44ms`  |
| omaha flop hand strength               | `705.99ns` | `848.78ns` |
| omaha river hand strength              | `5.87µs`   | `6.35µs`   |
| ...5 card omaha river                  | `8.39µs`   | `8.62µs`   |
| ...6 card omaha river                  | `11.12µs`  | `11.25µs`  |
| omaha river equity vs 1k random combos | `1.75ms`   | `2.37ms`   |
| omaha turn ahead vs range              | `963.77µs` | `1.45ms`   |
| omaha flop ahead vs range              | `556.12µs` | `1.14ms`   |

## Twoplustwo algorithm

By default this package uses a modified version of PHE (<https://github.com/HenryRLee/PokerHandEvaluator>) which returns equivalent values to the 2p2 algorithm, making them interchangeable. It can run on the browser since 5-7 card hashes are ~500 KB combined

The 2p2 algorithm is basically this, where hr is an precomputed array of ~32m ints

```py
p = 53
for card in cards
  p = hr[p + card]
return p
```

Since that requires a 124MB HandRanks.dat file to be loaded into memory, Poker-Hand-Evaluator is actually faster for random access since the lookup tables are so small and optimized better by the CPU

But for lots of random calculations on the same board, which is the case for the costliest operations (anything involving equity/multiple ranges), you can just store `p`, and now each hand only requires 2/3 lookups. Additionally, you're using much less of the lookup array resulting in better caching. The `genBoardEval` function implements this and leads to a 15-20x speedup

To load the HandRanks.dat file, which you can download here <https://github.com/chenosaurus/poker-evaluator/blob/master/data/HandRanks.dat> call `initFromPath`/`initFromPathSync`, or `init` if you already have the file loaded

## Explanation

### Isomorphism

Maps original suits to new suits such that all strategically identical boards turn into the same board. This implementation matches PioSOLVER which sorts flop descending by rank and assigns suits descending alphabetically (s -> h -> d -> c)

For example, all monotone flops become 3 spades (Kh7h3h -> Ks7s3s)

## Roadmap

- equities should be represented as [lose, chop, win]
- representing omaha ranges well (AKQ9ss type)
- bucketing, or other ways to trade precision for speed
- CLI commands for hash genration
- Monte carlo is necessary for many preflop and 3+ players spots, and maybe for PLO flops
- webassembly OMPEval <https://github.com/emscripten-core/emscripten> <https://emscripten.org/docs/porting/simd.html>
