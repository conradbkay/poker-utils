import twoplustwo from './twoplustwo.js'
import hashing from './hashing.js'
import phe from './phe.js'

const benchmarks = [hashing, twoplustwo, phe]

;(async () => {
  for (const bench of benchmarks) {
    await bench.run()
  }
})()
