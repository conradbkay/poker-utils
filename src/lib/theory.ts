export const alpha = (risk: number, reward: number) => {
  return risk / (risk + reward) / 100
}

export const mdf = (risk: number, reward: number) => {
  const a = alpha(risk, reward)

  return 1 - a
}

export const weak = (risk: number, reward: number) => {
  return risk / (risk + risk + reward)
}

export const alphaToPot = (alpha: number) => {
  if (alpha > 1) {
    alpha /= 100
  }

  const y = -alpha / (alpha - 1)

  return y
}

export const potToAlpha = (pct: number) => {
  return pct / (pct + 1)
}

export const raiseAlphaToWeak = (alpha: number, faced: number) => {
  const raiseSize = alphaToRaise(alpha, faced)
  const facedPct = alphaToPot(faced)

  return (raiseSize - facedPct) / (1 + 2 * raiseSize)
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

export const catchEVFromOdds = (weak: number, raise: number, bet: number) => {
  return weak * (1 + raise + bet) - (1 - weak) * (raise - bet)
}

export const alphaToRaise = (alpha: number, faced: number) => {
  return (-1 * alpha * faced - alpha) / (alpha - 1)
}

/**
 * @param value any percentage number
 * @param precision how many decimal places should be in the result
 * @returns number
 */
export const toPct = (value: number, precision: number = 1) => {
  const mult = Math.pow(10, precision + 2)

  return Math.round(value * mult) / mult
}
