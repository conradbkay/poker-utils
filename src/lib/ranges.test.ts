import test from 'ava'
import { resolveRanges } from './ranges'

test('resolveRanges', (t) => {
  const huSRP = resolveRanges(-2, -1, 1, 1)

  t.assert(huSRP.length === 2)
  t.assert(huSRP[0])
  t.assert(huSRP[1])
})
