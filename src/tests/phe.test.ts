import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { evaluate } from 'src/lib/evaluate'
import { boardToInts } from 'src/lib/cards/utils'

describe('phe', () => {
  it('should evaluate PHE correctly', () => {
    const board = boardToInts('7s 6s 3d')
    const hand = boardToInts('8s 9s')
    assert.equal(evaluate([...board, ...hand]).handName, 'High Card')
    // assert.equal(evaluate(board).handName, 'High Card') right now it only supports 5-7 card evals
  })
})
