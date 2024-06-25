export const mdf = (risk: number, reward: number) => {
  const alpha = risk / (risk + reward)

  return 100 - alpha
}

export const weak = (risk: number, reward: number) => {
  return risk / (risk + risk + reward)
}

export const alphaToPct = (alpha: number) => {
  const y = -alpha / (alpha - 1)

  return y
}

export const pctToAlpha = (pct: number) => {
  return pct / (pct + 1)
}

export const raiseAlphaToWeak = (alpha: number, faced: number) => {
  const raiseSize = alphaToRaise(alpha, faced)
  const facedPct = alphaToPct(faced)

  return (raiseSize - facedPct) / (1 + 2 * raiseSize)
}

export const alphaToWeak = (alpha: number) => {
  const pct = alphaToPct(alpha)

  return pct / (pct + pct + 1)
}

export const bluffEV = (fold: number, alpha: number) => {
  const size = alphaToPct(alpha)

  return fold - (1 - fold) * size
}

export const catchEV = (weak: number, size: number) => {
  return weak * (1 + size) - (1 - weak) * size
}

export const catchEVFromOdds = (weak: number, raise: number, bet: number) => {
  return weak * (1 + raise + bet) - (1 - weak) * (raise - bet)
}

export const alphaToRaise = (alpha: number, faced: number) => {
  return (-1 * alpha * faced - alpha) / (alpha - 1)
}
