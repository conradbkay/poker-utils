import { PokerRange } from './range.js'
import { sortCards } from '../sort.js'
import { genBoardEval } from '../evaluate.js'
import { PreflopRange } from './preflop.js'

/**
 * only for 2 card hands
 *
 * accessed by/from a 0-1325 combo idx
 *
 * all hands always exist in range, just as weight 0
 */
export class HoldemRange {
  private range: number[] // weighted

  constructor() {
    this.range = new Array(1326).fill(0) // fairly trivial allocation, but could use a sparse array instead
  }

  public getRange() {
    return this.range
  }

  public getWeight(idx: number) {
    return this.range[idx]
  }

  public set(idx: number, weight: number) {
    this.range[idx] = weight
  }

  public setHand(hand: number[], weight: number) {
    if (HoldemRange.getHandIdx(hand) >= 1326) {
      console.error(hand, HoldemRange.getHandIdx(hand))
      throw new Error('invalid hand')
    }
    this.set(HoldemRange.getHandIdx(hand), weight)
  }

  /** only iterates on combos with weight > 0 */
  public forEachWeighted(f: (weight: number, idx: number) => void) {
    for (let i = 0; i < this.range.length; i++) {
      if (this.range[i]) f(this.range[i], i)
    }
  }

  public static fromPokerRange(range: PokerRange) {
    const result = new HoldemRange()

    range.forEach((hand, weight) => {
      result.setHand(hand, weight)
    })

    return result
  }

  public static fromPreflopRange(range: PreflopRange) {
    return HoldemRange.fromPokerRange(PokerRange.fromPreflop(range))
  }

  public static getHandIdx(hand: number[]) {
    sortCards(hand)
    return (hand[0] * (hand[0] - 1)) / 2 + hand[1]
  }

  public static fromHandIdx(idx: number) {
    return idx2hand[idx]
  }

  // todo refactor this out into a few methods, and make it possible to get results for both hero and villain
  /*
  C(52, 2) means there are 1326 unique NLHE combos, and we can do basic map to convert each hand (two ints) to 0-1325 which we'll call comboIdx

  From both ranges, we can create an array `allCombos` of [strength, comboIdx, vsWeight, combo, weight]

  we sort that by strength, then compute the prefix sum for vsWeight

  now we can create a lookup such that every comboIdx maps to an index range ([min, max]) in `allCombos` for its hand strength

  that means that for any combo, we can simply use the lookup to get the weight sum of all combos we beat via `prefix[min - 1]`, the sum of ties via `prefix[max] - prefix[min]`, and the sum of losses via `totalWeight - win - tie`  

  but each combo removes 2 different cards from the deck, meaning it can only be up against one of C(50, 2) = 1225 combos, or rather it blocks 101 combos which we need to account for

  Another way to think about it is that each of its cards blocks 51 combos, and they both block a shared combo (AcQc would block AcQc twice)

  For each card in the deck, we can create another prefix sum for vsWeight, but this one will skip any combo that doesn't share a card/get blocked by it

  To get the final result for every combo in our range, we get the naive sums (win tie lose), but subtract the blocker prefix sums for both cards using the same logic, then simply undo the double blocked (equivalent) combo
  */
  /**
   * O(N log N) algorithm which only does O(N) evaluations, where N is the size of the union of range and vsRange
   *
   * Results get 10x faster after a few sequential calls for smaller ranges, even when completely randomizing the board and both ranges. Full ranges get a 3x speedup
   *
   * @returns [hand, win, tie, lose][], win/tie/lose are the sum of weights in vsRange
   */
  public equityVsRange({
    board,
    vsRange
  }: {
    board: number[]
    vsRange: HoldemRange
  }) {
    const boardEval = genBoardEval(board)

    const boardMask = new Array<boolean>(52).fill(false)
    for (const card of board) {
      boardMask[card] = true
    }

    // console.time('vsRange')
    const allCombos: [number, number, number, number[], number][] = []
    vsRange.forEachWeighted((weight, idx) => {
      const combo = HoldemRange.fromHandIdx(idx)
      if (boardMask[combo[0]] || boardMask[combo[1]]) {
        return
      }

      allCombos.push([
        boardEval(combo),
        HoldemRange.getHandIdx(combo),
        weight,
        combo,
        0
      ])
    })
    // console.timeEnd('vsRange')

    // console.time('insertMap')
    const insertMap = new Array<number>(1326) // handIdx to idx in allCombos
    for (let i = 0; i < allCombos.length; i++) {
      insertMap[allCombos[i][1]] = i
    }
    // console.timeEnd('insertMap')

    // console.time('range')
    this.forEachWeighted((weight, idx) => {
      const combo = HoldemRange.fromHandIdx(idx)
      if (boardMask[combo[0]] || boardMask[combo[1]]) {
        return
      }
      const handIdx = HoldemRange.getHandIdx(combo)
      if (insertMap[handIdx] !== undefined) {
        allCombos[insertMap[handIdx]][4] = weight
      } else {
        allCombos.push([boardEval(combo), handIdx, 0, combo, weight])
      }
    })
    // console.timeEnd('range')

    // console.time('sort')
    allCombos.sort((a, b) => a[0] - b[0]) // strength ascending
    // console.timeEnd('sort')

    // console.time('prefix')
    let totalWeight = 0
    let weightPrefix = new Array<number>(allCombos.length)

    let curP: number = -1
    let curPIdxRange: [number, number] = [0, 0]
    let idxToRange = new Array<[number, number]>(allCombos.length)
    let idxToSorted = new Array<number>(allCombos.length)
    for (let i = 0; i < allCombos.length; i++) {
      const [p, idx, weight] = allCombos[i]
      totalWeight += weight
      weightPrefix[i] = totalWeight

      if (p !== curP) {
        curP = p
        curPIdxRange = [i, i]
      } else {
        curPIdxRange[1] = i
      }

      idxToRange[idx] = curPIdxRange // pointer
      idxToSorted[idx] = i
    }
    // console.timeEnd('prefix')

    // console.time('blockedPrefix')
    const blockedPrefix = new Array<Array<number>>(52)
    for (let card = 0; card < 52; card++) {
      let cumBlockedWeight = 0
      blockedPrefix[card] = new Array<number>(allCombos.length)
      for (let i = 0; i < allCombos.length; i++) {
        const combo = allCombos[i][3]
        // significantly faster than .includes()
        if (combo[0] === card || combo[1] === card) {
          cumBlockedWeight += allCombos[i][2]
        }
        blockedPrefix[card][i] = cumBlockedWeight
      }
    }
    // console.timeEnd('blockedPrefix')

    // console.time('result')
    // todo seems like each handIdx is getting called twice?
    let result: [number[], number, number, number][] = []
    this.forEachWeighted((_, idx) => {
      const combo = HoldemRange.fromHandIdx(idx)
      if (boardMask[combo[0]] || boardMask[combo[1]]) {
        return null
      }

      const handIdx = HoldemRange.getHandIdx(combo)
      const idxRange = idxToRange[handIdx]
      const directIdx = idxToSorted[handIdx]

      let beatWeight = idxRange[0] > 0 ? weightPrefix[idxRange[0] - 1] : 0
      let tieWeight = weightPrefix[idxRange[1]] - beatWeight
      let afterBlockerWeight = totalWeight

      for (const card of combo) {
        const blockedWeight = blockedPrefix[card][allCombos.length - 1]
        const blockedBeatWeight = idxRange[0]
          ? blockedPrefix[card][idxRange[0] - 1]
          : 0
        const blockedTieWeight =
          blockedPrefix[card][idxRange[1]] -
          (idxRange[0] > 0 ? blockedPrefix[card][idxRange[0] - 1] : 0)

        afterBlockerWeight -= blockedWeight
        beatWeight -= blockedBeatWeight
        tieWeight -= blockedTieWeight
      }

      // undo double blocking the equal combo, which is always a tie
      const doubleBlockedWeight = allCombos[directIdx][2]
      afterBlockerWeight += doubleBlockedWeight
      tieWeight += doubleBlockedWeight

      const loseWeight = afterBlockerWeight - beatWeight - tieWeight

      result.push([combo, beatWeight, tieWeight, loseWeight])
    })
    // console.timeEnd('result')
    return result
  }
}

const idx2hand = new Array<number[]>(1326)
// 0.2ms
for (let a = 51; a >= 1; a--) {
  for (let b = a - 1; b >= 0; b--) {
    const hand = [a, b]
    idx2hand[HoldemRange.getHandIdx(hand)] = hand
  }
}
