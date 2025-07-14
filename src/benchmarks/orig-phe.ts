import { evaluateCardCodes } from 'phe'
import { run, bench } from 'mitata'
import { genRandHash, randCardsHashed, sequentialCards } from './utils'

/**
 * here to make sure the port doesn't become slower, which even though it's essentially the same small changes randomly make it slower
 */

genRandHash()

bench('phe sequential', () => {
  evaluateCardCodes(sequentialCards)
})
bench('phe rand 7 cards', () => {
  evaluateCardCodes(randCardsHashed(7))
})
bench('rand 5 cards', () => {
  evaluateCardCodes(randCardsHashed(5))
})

run()
