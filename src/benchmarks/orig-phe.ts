import { evaluateCardCodes } from 'phe'
import { run, bench, boxplot, summary, do_not_optimize } from 'mitata'
import { randCards, sequentialCards } from './utils.js'

/**
 * here to make sure the port doesn't become slower
 */

randCards(5) // init hash

bench('phe sequential', () => {
  evaluateCardCodes(sequentialCards)
})
bench('phe rand 7 cards', () => {
  evaluateCardCodes(randCards(7).map((c) => c - 1))
})
bench('rand 5 cards', () => {
  evaluateCardCodes(randCards(5).map((c) => c - 1))
})

run()
