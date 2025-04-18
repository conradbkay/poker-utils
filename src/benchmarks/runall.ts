import twoplustwo from './twoplustwo'
import hashing from './hashing'
import phe from './phe'

const benchmarks = [hashing, twoplustwo, phe]

;(async () => {
  for (const bench of benchmarks) {
    await bench.run()
  }
})()
