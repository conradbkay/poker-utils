import { HoldemRange } from '../lib/range/holdem'
import { any2 } from '../lib/range/range'
import { genRandHash, randCardsHashed } from './utils'
import { run, bench } from 'mitata'

/** have to put this in a separate file that doesn't load the 2p2 algorithm */

genRandHash()

const holdemAny2 = HoldemRange.fromPokerRange(any2)

bench('PHE range vs range river equity', () => {
  holdemAny2.equityVsRange({
    board: randCardsHashed(5),
    vsRange: holdemAny2
  })
})

run()
