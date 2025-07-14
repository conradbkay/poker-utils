import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import {
  alpha,
  alphaToPot,
  alphaToRaise,
  alphaToWeak,
  bluffEV,
  catchEVFromOdds,
  mdf,
  potToAlpha,
  raiseAlphaToWeak,
  toPct,
  weak
} from '../lib/theory'

describe('poker theory math', () => {
  test('alpha', () => {
    assert.equal(0.5, alpha(1, 1))
    assert.equal(0.75, alpha(3, 1))
  })

  test('mdf', () => {
    assert.equal(0.5, alpha(1, 1))
    assert.equal(0.25, mdf(3, 1))
  })

  test('weak', () => {
    assert.equal(0.4, weak(2, 1))
    assert.equal(0.25, weak(0.5, 1))
  })

  test('alphaToPot', () => {
    assert.equal(3, alphaToPot(0.75))
    assert.equal(1, alphaToPot(0.5))
    assert.equal(0.5, Math.round(alphaToPot(1 / 3) * 100) / 100)
  })

  test('potToAlpha', () => {
    assert.equal(0.75, potToAlpha(3))
  })

  test('raiseAlphaToWeak', () => {
    assert.equal(1 / 3, raiseAlphaToWeak(0.625, 0.5))
  })

  test('alphaToWeak', () => {
    assert.equal(1 / 3, alphaToWeak(0.5))
  })

  test('bluffEV', () => {
    assert.equal(0.2, Math.round(bluffEV(0.6, 0.5) * 100) / 100)
  })

  test('catchEvFromOdds', () => {
    assert.equal(-0, Math.round(catchEVFromOdds(1 / 3, 2.5, 0.5) * 100))
  })

  test('alphaToRaise', () => {
    assert.equal(2.5, alphaToRaise(0.625, 0.5))
    assert.equal(6, Math.round(alphaToRaise(0.8, 0.5) * 100) / 100)
  })

  test('toPct', () => {
    assert.equal(33.33, toPct(1 / 3, 2))
    assert.equal(33.333, toPct(1 / 3, 3))
  })
})
