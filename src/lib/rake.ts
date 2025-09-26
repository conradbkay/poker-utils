/*
last updated 11/10/24
int in tuple is BB cents (inclusive), array is rake cap in cents, starting at 2 players
*/

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
  [2, [5, 10, 15, 20, 20]],
  [5, [13, 25, 38, 50, 50]],
  [10, [25, 50, 75, 100, 100]],
  [25, [50, 100, 150, 200, 200]],
  [50, [100, 200, 300, 400, 400]],
  [100, [125, 250, 375, 500, 500]],
  [200, [150, 300, 450, 600, 600]],
  [500, [200, 400, 600, 800, 800]],
  [1000, [250, 500, 750, 1000, 1000]],
  [2000, [500, 1000, 1500, 2000, 2000]],
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
  [2, [2, 3, 5, 6, 6]],
  [5, [4, 8, 11, 15, 15]],
  [10, [8, 15, 23, 30, 30]],
  [25, [19, 38, 56, 75, 75]],
  [50, [25, 50, 75, 100, 100]],
  [100, [50, 100, 150, 200, 400]],
  [200, [100, 200, 300, 400, 400]],
  [500, [187, 375, 562, 750, 750]],
  [1000, [375, 750, 1125, 1500, 1500]],
  [2000, [750, 1500, 2250, 3000, 3000]]
]

const ggAnteCutoffs: Cutoff[] = [
  [2, [8, 15, 23, 30, 30]],
  [5, [19, 38, 56, 75, 75]],
  [10, [38, 175, 113, 150, 150]],
  [25, [63, 125, 188, 250, 250]],
  [50, [100, 200, 300, 400, 400]],
  [100, [125, 250, 375, 500, 500]],
  [200, [150, 300, 450, 600, 600]],
  [500, [200, 400, 600, 800, 800]]
]

// https://coinpoker.com/community-contributions/
const coinCutoffs: Cutoff[] = [
  [2, [10, 15, 15, 20, 20, 20]],
  [5, [20, 30, 30, 40, 40, 40]],
  [10, [35, 50, 50, 70, 70, 70]],
  [25, [75, 110, 110, 150, 150, 150]],
  [50, [100, 150, 150, 200, 200, 200]],
  [100, [125, 185, 185, 250, 250, 250]],
  [200, [150, 225, 225, 300, 300, 300]],
  [500, [200, 300, 300, 400, 400, 400]],
  [1000, [300, 450, 450, 600, 600, 600]],
  [2000, [400, 600, 600, 800, 800, 800]],
  [5000, [500, 750, 750, 1000, 1000, 1000]],
  [10000, [750, 1125, 1125, 1500, 1500, 1500]],
  [20000, [1000, 1500, 1500, 2000, 2000, 2000]],
  [40000, [2000, 3000, 3000, 4000, 4000, 4000]],
  [60000, [3000, 4500, 4500, 6000, 6000, 6000]]
]

const cap = (cutoffs: Cutoff[]) => (BB: number, dealt: number) => {
  const useIdx = cutoffs.findLastIndex((c) => BB <= c[0])

  return cutoffs[useIdx][1][Math.min(4, dealt - 2)]
}

// this changed some time around, ideally they should pass in an epoch (or just provide a separate "Stars Old" rake object)
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

const ggAnteInfo = {
  atEnd: true,
  raked3bets: true,
  percent: () => 0.05,
  cap: cap(ggAnteCutoffs)
}

const coinPokerInfo = {
  atEnd: false,
  percent: () => 0.05,
  cap: cap(coinCutoffs)
}

export const rake: Record<
  string,
  {
    atEnd: boolean
    percent: (bb: number) => number
    cap: ReturnType<typeof cap>
  }
> = {
  PS: starsInfo,
  Stars: starsInfo,
  PokerStars: starsInfo,
  GG: ggInfo,
  GGAnte: ggAnteInfo,
  GGPoker: ggInfo,
  GGPokerAnte: ggAnteInfo,
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
  Bovada: iggyInfo,
  Coin: coinPokerInfo,
  CoinPoker: coinPokerInfo
}
