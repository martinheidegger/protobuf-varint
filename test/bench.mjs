import { decode, encode } from '../lib/int32/index.mjs'
import crypto from 'node:crypto'
/*
  benchmark encoding and decoding N random integers.

  A number is encoded into a buffer, (the buffer is reused so
  that allocation does not affect the benchmark)

  to test the effect on performance of invalid records
  (i.e. too short, with the Most Significant Byte missing)
  every M items, attempt to decode from a shorter slice of the buffer.
  This will probably be produce an invalid result. We do not
  need to write into that buffer - because it refurs to the same memory as
  the full size buffer.

  run with INVALID=1 to include N/M invalid decodes.

  results:
    with no invalid decodes, I get about 2428 decodes/ms
    with invalid decodes:
      old code that overruns buffer: 1122 decodes/ms
      check length & return undefined: 2439 decodecs/ms
      check length & return NaN: 2434 d/ms
      check length & return -1: 2400 d/ms

  conclusion, it doesn't make a significant difference whether
  what is returned to show an invalid read,
  but if you overrun the buffer the cost is considerable.

  recomendation: return undefined
*/
const count = 10000000
const bytes = crypto.randomBytes(count)
const target = new Uint8Array(count)
let i = 0
let numcount = 0
let num = 0 // { low: 0, high: 0, unsigned: true }
let start = Date.now()
while (i < count - 10) {
  num = decode(bytes, i)
  encode(num, target, i)
  i += decode.bytes
  numcount += 1
}
console.log(`${numcount} decoded/encoded in ${Date.now() - start}ms`)
