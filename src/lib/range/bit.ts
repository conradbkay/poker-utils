import { BitSet } from 'bitset'
import { PokerRange } from './range.js'
import { getHandIdx } from '../utils.js'

// exported for testing
// ! 52 length so access with card-1
export let idxBlocks: BitSet[] = []

const initBlockers = () => {
  for (let i = 1; i <= 52; i++) {
    let arr = new BitSet()
    for (let j = i + 1; j <= 52; j++) {
      const idx = getHandIdx([j, i])
      arr.set(idx, 1)
    }
    idxBlocks.push(arr)
  }
}
initBlockers() // todo could generate it as needed

/** 1326 */
export const cardsBlockBitmap = (
  cards: number[],
  oneMeansBlocked?: boolean
) => {
  let result: BitSet

  for (const card of cards) {
    if (!result) {
      result = idxBlocks[card - 1]
    } else {
      result = result.or(idxBlocks[card - 1])
    }
  }

  if (oneMeansBlocked) {
    return result
  }

  return result.not() // sets cardinality to inf
}

/**
 * stores two-card postflop ranges as 1326 bits, and 1326 length float32 weights
 */
export class BitRange {
  bitmap: BitSet
  weights: Float32Array // maybe would prefer float16 but that's not in node. Could use https://www.npmjs.com/package/@petamoriken/float16

  constructor() {
    this.reset()
  }

  public reset() {
    this.bitmap = new BitSet()
    this.weights = new Float32Array(1326)
    return this
  }

  public set(idx: number, weight = 1) {
    this.bitmap.set(idx, weight ? 1 : 0)
    this.weights[idx] = weight
    return this
  }

  // doesn't zero blocked weights
  public applyBlockers(blocked: BitSet) {
    this.bitmap = this.bitmap.and(blocked)
    return this
  }

  public blockedBitmap(blocked: BitSet) {
    return this.bitmap.and(blocked)
  }

  public static fromPokerRange(range: PokerRange) {
    let result = new BitRange()

    range.forEach((c, w) => {
      result.set(getHandIdx(c), w)
    })

    return result
  }
}
