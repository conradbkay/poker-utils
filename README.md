# poker-utils

Really fast poker evaluation in pure TypeScript

- NLHE and 4-6 card Omaha strength evaluation
- fast isomorphism and weighted isomorphic runouts
- fast board/cards sort via sorting networks
- advanced poker theory math like `alpha`, `bluffEv`, and `catchEV`
- range operations (`combosVsRangeEquity`)
- easily generate and access from a hash of every combo on every unique flop
- Zero dependencies
- site-specific rake information

Returned percentages are always between 0 and 1

deck is 1-indexed ascending from 2 to 'a' (Ace) alphabetic suit tie-break (c,d,h,s)

"ahead" methods don't look at each runout like the corresponding "equity" methods do

## Quickstart

The highest-level usage is with the `evaluate` function

## Benchmarks

V8 is pretty fast, but the fastest algorithms (OMPEval) use SIMD or bit behavior only feasible in JS with `BigInt` (slow)

Ran using `mitata` for `poker-utils v11.0.0`

clk: ~5.03 GHz
cpu: Intel(R) Core(TM) i5-14600K
runtime: node 23.11.0 (x64-win32)

| benchmark                               | avg              | min         | p75         | p99         | max         |
| --------------------------------------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| Node.js 6 card .sort                    | ` 77.04 ns/iter` | ` 65.97 ns` | ` 84.57 ns` | `135.74 ns` | `198.44 ns` |
| ...`(sortCards)`                        | `  7.96 ns/iter` | `  7.69 ns` | `  7.91 ns` | ` 10.82 ns` | `121.56 ns` |
| range to isomorphic                     | `736.89 µs/iter` | `550.30 µs` | `735.80 µs` | `937.20 µs` | `  1.31 ms` |
| generate river runouts                  | `  1.51 µs/iter` | `  1.45 µs` | `  1.52 µs` | `  1.62 µs` | `  1.68 µs` |
| generate turn+river runouts             | ` 54.30 µs/iter` | ` 27.40 µs` | ` 62.30 µs` | `150.00 µs` | `276.50 µs` |
| flop isomorphism                        | `130.08 ns/iter` | `122.78 ns` | `129.27 ns` | `154.96 ns` | `170.02 ns` |
| river isomorphism                       | `210.99 ns/iter` | `199.90 ns` | `214.01 ns` | `239.06 ns` | `265.84 ns` |
| phe sequential+convert                  | ` 54.54 ns/iter` | ` 51.03 ns` | ` 53.25 ns` | ` 82.86 ns` | `140.65 ns` |
| 2p2 sequential                          | ` 23.32 ns/iter` | ` 21.90 ns` | ` 23.95 ns` | ` 26.34 ns` | ` 93.16 ns` |
| phe rand 7 cards                        | ` 69.49 ns/iter` | ` 63.67 ns` | ` 67.36 ns` | `104.88 ns` | `220.63 ns` |
| 2p2 rand 7 cards                        | `199.00 ns/iter` | `154.79 ns` | `229.27 ns` | `290.99 ns` | `384.45 ns` |
| 2p2 random 2 cards on fixed river       | ` 11.90 ns/iter` | ` 11.23 ns` | ` 12.23 ns` | ` 15.38 ns` | ` 42.43 ns` |
| 2p2 random 2 cards on fixed flop        | ` 16.62 ns/iter` | ` 15.63 ns` | ` 17.07 ns` | ` 21.68 ns` | ` 59.77 ns` |
| 2p2 river full range vs range equity    | `861.75 µs/iter` | `767.10 µs` | `868.50 µs` | `  1.09 ms` | `  1.60 ms` |
| 4 card omaha flop hand strength         | `651.75 ns/iter` | `608.13 ns` | `663.72 ns` | `740.55 ns` | `800.20 ns` |
| 4 card omaha river hand strength        | `  4.14 µs/iter` | `  3.99 µs` | `  4.17 µs` | `  4.42 µs` | `  4.65 µs` |
| ...5 cards                              | `  6.04 µs/iter` | `  5.83 µs` | `  6.12 µs` | `  6.39 µs` | `  6.98 µs` |
| ...6 cards                              | `  7.87 µs/iter` | `  7.73 µs` | `  7.88 µs` | `  8.05 µs` | `  8.15 µs` |
| omaha river equity vs 1000 random hands | `  1.58 ms/iter` | `  1.40 ms` | `  1.62 ms` | `  1.98 ms` | `  2.35 ms` |
| omaha turn ahead vs range               | `880.33 µs/iter` | `794.90 µs` | `884.60 µs` | `  1.06 ms` | `  1.11 ms` |
| omaha flop ahead vs range               | `547.61 µs/iter` | `463.10 µs` | `543.80 µs` | `914.70 µs` | `  1.11 ms` |

## Twoplustwo algorithm

The 2p2 algorithm is basically this, where hr is an precomputed array of ~32m ints

```py
p = 53
for card in cards
  p = hr[p + card]
# (if 5 or 6 cards) p = hr[p]
return p
```

Since that requires a 124MB HandRanks.dat file to be loaded into memory, Poker-Hand-Evaluator is actually faster for random access since the lookup tables are so small and optimized better by the CPU

But for lots of random calculations on the same board, which is the case for the costliest operations (anything involving equity/multiple ranges), you can just store `p`, and now each hand only requires 2/3 lookups. Additionally, you're using much less of the lookup array resulting in better caching. The `genBoardEval` function implements this and leads to a 15-20x speedup

There are a few ways to load the HandRanks.dat file, which you can download here <https://github.com/chenosaurus/poker-evaluator/blob/master/data/HandRanks.dat>

1. call `initFromPath` or `initFromPathSync` to load the file immediately
2. `lazyInitFromPath` loads the file when it is first needed
3. call `init` if you already have the file loaded

## Explanation

### Isomorphism

Maps original suits to new suits such that all strategically identical boards turn into the same board. This implementation matches PioSOLVER which sorts flop descending by rank and assigns suits descending alphabetically (s -> h -> d -> c)

For example, all monotone flops become 3 spades (Kh7h3h -> Ks7s3s)

## Roadmap

- equities should be represented as [lose, chop, win]
- representing omaha ranges well (AKQ9ss type)
- bucketing
- all the specific range functionality should map in/out of 1326 (169 for preflop) values as weights
- probably centralize hashes to one class with method to initialize all but default lazy fetch
- exported RFPHE class
- CLI commands for hash genration (PHE omaha, flops)
- Monte carlo necessary for many preflop and 3+ players spots, and maybe for PLO flops
- webassembly OMPEval <https://github.com/emscripten-core/emscripten> <https://emscripten.org/docs/porting/simd.html>

## Breaking Changes

### v11

- removed `ranksFile` argument everywhere

### v10

Added option to use `PHE` for evaluation, which is a JS port of <https://github.com/HenryRLee/PokerHandEvaluator>. It can run on the browser since 5-7 card hashes are ~500 KB combined

- `omahaAheadScore` -> `omahaAheadPct`
- `combosVsRangeEquity` -> `rangeVsRangeAhead`
- `init` -> `initFromPath`
