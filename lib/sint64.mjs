import {
  HI0,
  HI1,
  HI2,
  HI3,
  HI4,
  HI5,
  LO1,
  LO2,
  LO3,
  LO4,
  fixedEncoders as fixedUint,
  decode as decodeUint,
} from './uint64.mjs'
export { validate } from './int64.mjs'

export const name = 'sint64'

export function decode(bytes, offset = 0, long = { low: 0, high: 0 }) {
  decodeUint(bytes, offset, long)
  const n = -(long.low & 1)
  long.low = ((long.low >>> 1) | (long.high << 31)) ^ n
  long.high = (long.high >>> 1) ^ n
  long.unsigned = false
  decode.bytes = decodeUint.bytes
  return long
}
decode.bytes = 1

export function encode(long, target, offset) {
  const { bytes, encode: fixEncode } = fixedEncoder(long)
  encode.bytes = bytes
  return fixEncode(long, target, offset)
}
encode.bytes = 1

export function encodeLength(long) {
  return fixedEncoder(long).bytes
}

const tmp = { low: 0, high: 0, unsigned: true }
const fixedEncoders = [
  ...fixedUint.slice(0, 9).map(({ bytes, encode }) => ({
    bytes,
    encode(long, out, offset) {
      tmp.low = long.low << 1
      tmp.high = (long.high << 1) | (long.low >>> 31)
      return encode(tmp, out, offset)
    },
  })),
  ...fixedUint.map(({ bytes, encode }) => ({
    bytes,
    encode(long, out, offset) {
      tmp.low = (long.low << 1) ^ -1
      tmp.high = ((long.high << 1) | (long.low >>> 31)) ^ -1
      return encode(tmp, out, offset)
    },
  })),
].map(Object.freeze)

const [
  p1,
  p2,
  p3,
  p4,
  p5,
  p6,
  p7,
  p8,
  p9,
  n1,
  n2,
  n3,
  n4,
  n5,
  n6,
  n7,
  n8,
  n9,
  n10,
] = fixedEncoders

export function fixedEncoder(input) {
  if (input.high < 0) {
    const hi = ((input.high << 1) | (input.low >>> 31)) ^ -1
    if (hi & HI5) return n10
    if (hi & HI4) return n9
    if (hi & HI3) return n8
    if (hi & HI2) return n7
    if (hi & HI1) return n6

    const lo = (input.low << 1) ^ -1
    if (hi & HI0 || lo & LO4) return n5
    if (lo & LO3) return n4
    if (lo & LO2) return n3
    if (lo & LO1) return n2
    return n1
  } else {
    const hi = (input.high << 1) | (input.low >>> 31)
    if (hi & HI4) return p9
    if (hi & HI3) return p8
    if (hi & HI2) return p7
    if (hi & HI1) return p6

    const lo = input.low << 1
    if (hi & HI0 || lo & LO4) return p5
    if (lo & LO3) return p4
    if (lo & LO2) return p3
    if (lo & LO1) return p2
    return p1
  }
}
