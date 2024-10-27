// first int in tuple is BB cents (inclusive)
type Cutoff = [number, number[]]

const iggyCutoffs: Cutoff[] = [
  [25, [50, 100, 100, 200, 200]],
  [2000, [100, 200, 300, 300, 400]]
]

const acrCutoffs: Cutoff[] = [
  [200, [50, 100, 200, 300, 300]],
  [600, [100, 150, 200, 300, 300]],
  [20000, [125, 175, 225, 300, 300]]
]

const ggCutoffs: Cutoff[] = [
  [2, [10, 10, 20, 20, 20]],
  [5, [25, 25, 50, 50, 50, 50]],
  [10, [50, 50, 100, 100, 100]],
  [25, [100, 100, 200, 200, 200]],
  [50, [200, 200, 400, 400, 400]],
  [100, [250, 250, 500, 500, 500]],
  [200, [300, 300, 600, 600, 600]],
  [500, [400, 400, 800, 800, 800]],
  [2000, [500, 500, 1000, 1000, 1000]],
  [5000, [1250, 1250, 2500, 2500, 2500]],
  [10000, [2500, 2500, 5000, 5000, 5000]],
  [20000, [5000, 5000, 10000, 10000, 10000]],
  [40000, [10000, 10000, 20000, 20000, 20000]]
]

const starsCutoffs: Cutoff[] = [
  [2, [30, 30, 30, 30, 30, 30, 30, 30]],
  [5, [50, 50, 50, 100, 100, 100, 100, 100]],
  [10, [50, 100, 100, 150, 150, 150, 150, 150]],
  [25, [50, 100, 100, 200, 200, 200, 200, 200]],
  [50, [75, 75, 75, 200, 200, 200, 200, 200]],
  [100, [100, 100, 100, 250, 250, 250, 250, 250]],
  [200, [125, 125, 125, 250, 275, 275, 275, 275]],
  [500, [150, 150, 150, 300, 300, 300, 300, 300]],
  [1000, [150, 150, 150, 300, 300, 300, 300, 300]],
  [2000, [175, 175, 175, 300, 300, 300, 300, 300]],
  [5000, [225, 200, 200, 300, 300, 300, 300, 300]],
  [20000, [250, 300, 300, 500, 500, 500, 500, 500]]
]

const ggPloCutoffs: Cutoff[] = [
  [5, [8, 8, 15, 15, 15, 15, 15, 15]],
  [10, [15, 15, 30, 30, 30, 30, 30, 30]],
  [25, [38, 38, 75, 75, 75, 75, 75, 75]],
  [50, [50, 50, 100, 100, 100, 100, 100, 100]],
  [100, [100, 100, 200, 200, 200, 200, 200, 200]],
  [200, [200, 200, 400, 400, 400, 400, 400, 400]],
  [500, [375, 375, 750, 750, 750, 750, 750, 750]]
]

const cap = (cutoffs: Cutoff[]) => (BB: number, dealt: number) => {
  const useIdx = cutoffs.findLastIndex((c) => BB <= c[0])

  return cutoffs[useIdx][1][Math.min(4, dealt - 2)]
}

// this changed some time around, ideally they should pass in an epoch (or just provide a separate "Stars Old" rake obj)
const starsInfo = {
  atEnd: false,
  percent: (BBCents: number) => (BBCents >= 1000 ? 0.045 : 0.05),
  cap: cap(starsCutoffs)
}

const ggInfo = {
  atEnd: true,
  raked3bets: true,
  percent: () => 0.05,
  cap: cap(ggCutoffs)
}

const ggPloInfo = {
  ...ggInfo,
  cap: cap(ggPloCutoffs)
}

const acrInfo = {
  atEnd: false,
  percent: () => 0.05,
  cap: cap(acrCutoffs)
}

const iggyInfo = {
  atEnd: false,
  percent: () => 0.05,
  cap: cap(iggyCutoffs)
}

export const rake: Record<
  string,
  {
    atEnd: boolean
    percent: (bb: number) => number
    cap: ReturnType<typeof cap>
  }
> = {
  Stars: starsInfo,
  PokerStars: starsInfo,
  GG: ggInfo,
  GGPoker: ggInfo,
  Natural8: ggInfo,
  GGPLO: ggPloInfo,
  GGPokerPLO: ggPloInfo,
  Natural8PLO: ggPloInfo,
  ACR: acrInfo,
  BCP: acrInfo,
  WPN: acrInfo,
  PWL: iggyInfo,
  Ignition: iggyInfo,
  Bodog: iggyInfo,
  Bovada: iggyInfo
}
