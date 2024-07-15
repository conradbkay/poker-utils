import test from 'ava'

import hash from './combinationsHash'

test('hash', (t) => {
  t.deepEqual(hash[5][3][0], [0, 1, 2])
})
