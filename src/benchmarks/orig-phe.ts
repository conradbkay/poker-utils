import { evaluateCardCodes } from 'phe'
import { run, bench, boxplot, summary, do_not_optimize } from 'mitata'
import { randCardsHashed, sequentialCards } from './utils.js'

/**
 * here to make sure the port doesn't become slower, which even though it's essentially the same small changes randomly make it slower
 */

randCardsHashed(5) // init hash

bench('phe sequential', () => {
  evaluateCardCodes(sequentialCards)
})
bench('phe rand 7 cards', () => {
  evaluateCardCodes(randCardsHashed(7).map((c) => c - 1))
})
bench('rand 5 cards', () => {
  evaluateCardCodes(randCardsHashed(5).map((c) => c - 1))
})

run()
