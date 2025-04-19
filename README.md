# rfphe

really fast poker hand evaluation. 100% TypeScript

- NLHE and 4-6 card Omaha strength evaluation
- fast isomorphism and weighted isomorphic runouts
- fast board/cards sort via sorting networks
- advanced poker theory math like `alpha`, `bluffEv`, and `catchEV`
- range operations (`combosVsRangeEquity`)
- easily generate and access from a hash of every combo on every unique flop
- site-specific rake information

Returned percentages are always between 0 and 1

deck is 1-indexed ascending from 2 to 'a' (Ace) alphabetic suit tie-break (c,d,h,s)

"ahead" methods don't look at each runout like the corresponding "equity" methods do

## Benchmarks

(screenshot)

## Twoplustwo algorithm

The 2p2 algorithm is basically this, where hr is an precomputed array of ~32m ints. 5-6 card evaluation just requires an extra lookup at the end

```py
p = 53
for card in cards
  p = hr[p + card]
return p
```

Since that requires a 124MB HandRanks.dat file to be loaded into memory, Poker-Hand-Evaluator is actually faster for random access since the lookup tables are so small and optimized better by the CPU

But for lots of random calculations on the same board, which is the case for the costliest operations (anything involving equity/multiple ranges), you can just store `p`, and now each hand only requires 2/3 lookups. Additionally, you're using much less of the lookup array resulting in better caching

There are several ways to load the HandRanks.dat file which you can download here <https://github.com/chenosaurus/poker-evaluator/blob/master/data/HandRanks.dat>

1. call `initFromPath` or `initFromPathSync` to load the file immediately
2. `lazyInitFromPath` loads the file when it is first needed
3. pass `ranksPath` to any functions you call, or just the first
4. call `init` if you already have the file loaded

## Usage Guide

The simplest usage is with the `evaluate` function

If you are calculating many hand strengths on a specific board, `genBoardEval` can give up to a 20x speedup. Many of the higher-level functions utilize this already

`p` represents a uint32 from the 2p2 algorithm

## Roadmap

- Weighted ranges. Probably just implement some isomorphic prange. lookup using arr of 169 preflop hands and memorized combos per. Range itself would be an object like {"K9s": .4, "66": 1} which wouldn't need to have any zero values
- Monte carlo necessary for many preflop and 3+ players spots, and maybe for PLO flops
- webassembly OMPEval <https://github.com/emscripten-core/emscripten> <https://emscripten.org/docs/porting/simd.html>

## Breaking Changes

### v10

Added option to use `PHE` for evaluation, which is a JS port of <https://github.com/HenryRLee/PokerHandEvaluator>. It returns stronger hands as closer to zero, uses a 0-indexed deck, and can run on the browser

- `omahaAheadScore` -> `omahaAheadPct`
- `combosVsRangeEquity` -> `rangeVsRangeAhead`
- `init` -> `initFromPath`
