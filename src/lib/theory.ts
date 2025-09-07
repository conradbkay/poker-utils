export const alpha = (risk: number, reward: number) => {
  return risk / (risk + reward)
}

export const mdf = (risk: number, reward: number) => {
  return 1 - alpha(risk, reward)
}

export const weak = (risk: number, reward: number) => {
  return risk / (risk + risk + reward)
}

export const alphaToPot = (alpha: number) => {
  return -alpha / (alpha - 1)
}

export const potToAlpha = (pct: number) => {
  return pct / (pct + 1)
}

export const raiseAlphaToWeak = (alpha: number, faced: number) => {
  const raiseSize = alphaToRaise(alpha, faced)

  return (raiseSize - faced) / (1 + 2 * raiseSize)
}

export const alphaToWeak = (alpha: number) => {
  const pct = alphaToPot(alpha)

  return pct / (pct + pct + 1)
}

export const bluffEV = (fold: number, alpha: number) => {
  const size = alphaToPot(alpha)

  return fold - (1 - fold) * size
}

export const catchEV = (weak: number, size: number) => {
  return weak * (1 + size) - (1 - weak) * size
}

/** expects raise/bet in fraction of pot */
export const catchEVFromOdds = (weak: number, raise: number, bet: number) => {
  const reward = 1 + raise + bet
  const risk = raise - bet
  const lose = 1 - weak
  return weak * reward - lose * risk
}

export const alphaToRaise = (alpha: number, faced: number) => {
  return (-1 * alpha * faced - alpha) / (alpha - 1)
}

/**
 * @param value 0-1
 * @param precision how many decimal places should be in the result
 * @returns 0-100
 */
export const toPct = (value: number, precision = 1) => {
  const mult = Math.pow(10, precision + 2)

  return (Math.round(value * mult) * 100) / mult
}
