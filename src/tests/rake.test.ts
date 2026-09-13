import { test } from 'node:test'
import assert from 'node:assert/strict'
import { rake } from '../lib/rake'

test('rake caps use the first inclusive stake cutoff', () => {
  assert.equal(rake.GG.cap(2, 2), 5)
  assert.equal(rake.GG.cap(25, 6), 200)
  assert.equal(rake.Stars.cap(2, 2), 30)
  assert.equal(rake.WPTUSD.cap(5, 2), 15)
})

test('rake caps use the next stake cutoff between published rows', () => {
  assert.equal(rake.GG.cap(3, 2), 13)
  assert.equal(rake.WPTCNY.cap(6, 2), 60)
})

test('rake caps clamp out-of-range dealt counts', () => {
  assert.equal(rake.GG.cap(2, 1), 5)
  assert.equal(rake.Stars.cap(2, 10), 30)
})
