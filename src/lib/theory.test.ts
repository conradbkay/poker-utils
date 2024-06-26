import test from 'ava'

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
} from './theory'

test('alpha', (t) => {
  t.is(0.5, alpha(1, 1))
  t.is(0.75, alpha(3, 1))
})

test('mdf', (t) => {
  t.is(0.5, alpha(1, 1))
  t.is(0.25, mdf(3, 1))
})

test('weak', (t) => {
  t.is(0.4, weak(2, 1))
  t.is(0.25, weak(0.5, 1))
})

test('alphaToPot', (t) => {
  t.is(3, alphaToPot(0.75))
  t.is(1, alphaToPot(0.5))
  t.is(0.5, Math.round(alphaToPot(1 / 3) * 100) / 100)
})

test('potToAlpha', (t) => {
  t.is(0.75, potToAlpha(3))
})

test('raiseAlphaToWeak', (t) => {
  t.is(1 / 3, raiseAlphaToWeak(0.625, 0.5))
})

test('alphaToWeak', (t) => {
  t.is(1 / 3, alphaToWeak(0.5))
})

test('bluffEV', (t) => {
  t.is(0.2, Math.round(bluffEV(0.6, 0.5) * 100) / 100)
})

test('catchEvFromOdds', (t) => {
  t.is(-0, Math.round(catchEVFromOdds(1 / 3, 2.5, 0.5) * 100))
})

test('alphaToRaise', (t) => {
  t.is(2.5, alphaToRaise(0.625, 0.5))
  t.is(6, Math.round(alphaToRaise(0.8, 0.5) * 100) / 100)
})

test('toPct', (t) => {
  t.is(33.33, toPct(1 / 3, 2))
})
