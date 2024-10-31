import test from 'ava'
import { resolveRanges } from './ranges'
import { boardToInts } from './eval/utils'

test('resolveRanges', (t) => {
  const huSRP = resolveRanges(-2, -1, 1, 1)

  t.assert(huSRP.length === 2)
  t.assert(huSRP[0])
  t.assert(huSRP[1])
})

test('boardToInts', (t) => {
  t.deepEqual(boardToInts(['As', '4s']), [52, 12])
})
