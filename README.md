# rfphe

A fast but pure JS library for evaluating poker hands

- hand strength evaluation
- fast isomorphism
- calculate equity of each combo in a range vs a specified range via `combosVsRangeAhead`
- generate a hash of every flop combo's equity vs a specified range
- site-specific rake information
- 4-6 card Omaha evaluation

Returned percentages are always between 0 and 1

deck is 1-indexed ascending from 2 to 'a' (Ace) alphabetic suit tie-break (cdhs)

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

Since that requires a 124MB HandRanks.dat file to be loaded into memory, PHE is actually faster for random access since the lookup tables are so small and therefore cached better

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

## Features

- very fast `combosVsRangeEquity` method

## Roadmap

- Weighted ranges
- Monte carlo necessary for many preflop and 3+ players spots, maybe PLO flops

## Breaking Changes

### v10

Added option to use `PHE` for evaluation, which is a JS port of <https://github.com/HenryRLee/PokerHandEvaluator>. It returns stronger hands as closer to zero, uses a 0-indexed deck, and can run on the browser

- `omahaAheadScore` -> `omahaAheadPct`
- `combosVsRangeEquity` -> `rangeVsRangeAhead`
- `init` -> `initFromPath`
