/*import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { evaluate } from '../lib/omp/main'

test('OMP port evaluation', (t) => {
  const quadAcesIndices = [48, 49, 50, 51, 44, 0, 4] // As Ah Ac Ad Ks 2s 3s
  const result1 = evaluate(quadAcesIndices)
  assert.equal(result1.categoryName, 'Four of a Kind')

  const straight6HighIndices = [20, 16, 12, 8, 4, 49, 50] // 6s 5s 4s 3s 2s Ah Ac
  const result2 = evaluate(straight6HighIndices)
  assert.equal(result2.categoryName, 'Straight Flush')

  const straight6HighMixedIndices = [20, 17, 12, 9, 4, 49, 50] // 6s 5h 4s 3h 2s Ah Ac
  const result3 = evaluate(straight6HighMixedIndices)
  assert.equal(result3.categoryName, 'Straight')
})*/
