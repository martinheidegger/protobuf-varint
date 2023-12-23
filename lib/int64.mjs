import {
  HI0,
  HI1,
  HI2,
  HI3,
  HI4,
  LO1,
  LO2,
  LO3,
  LO4,
  fixedEncoders as fixedUint64,
  decode as decodeUint,
} from './uint64.mjs'
import { INVALID_LONG } from './errors.mjs'

export const name = 'int64'

const ulong = { low: 0, high: 0, unsigned: true }
const max = { low: -1, high: -1, unsigned: false }

export function decode(
  bytes,
  offset = 0,
  long = { low: 0, high: 0, unsigned: false },
) {
  decodeUint(bytes, offset, ulong)
  if (ulong.high < 0 && ulong.low < 0) {
    long.low = ulong.low & max.low
    long.high = ulong.high & max.high
  } else {
    long.low = ulong.low
    long.high = ulong.high
  }
  long.unsigned = false
  decode.bytes = decodeUint.bytes
  return long
}
decode.bytes = 1

export function encodeLength(long) {
  return fixedEncoder(long).bytes
}

export function encode(long, target, offset) {
  const { bytes, encode: fixEncode } = fixedEncoder(long)
  encode.bytes = bytes
  return fixEncode(long, target, offset)
}
encode.bytes = 1

const [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10] = fixedUint64
const p10encode = p10.encode
const tmp = { low: 0, high: 0, unsigned: true }
const n10 = Object.freeze({
  bytes: 10,
  encode(long, out, offset) {
    const { low, high } = long
    let c00 = low & 0xffff
    let c16 = c00 >>> 16
    c00 &= 0xffff
    c16 += low >>> 16
    let c32 = c16 >>> 16
    c16 &= 0xffff
    c32 += high & 0xffff
    const c48 = (c32 >>> 16) + (high >>> 16) - 32768
    tmp.low = (c16 << 16) | c00
    tmp.high = ((c48 & 0xffff) << 16) | (c32 & 0xffff)
    return p10encode(tmp, out, offset)
  },
})

export function fixedEncoder(long) {
  const { low, high } = long
  return high < 0
    ? n10
    : high & HI4
      ? p9
      : high & HI3
        ? p8
        : high & HI2
          ? p7
          : high & HI1
            ? p6
            : high & HI0 || low & LO4
              ? p5
              : low & LO3
                ? p4
                : low & LO2
                  ? p3
                  : low & LO1
                    ? p2
                    : p1
}

export function validate(input) {
  if (typeof input != 'object' || input === null) {
    return INVALID_LONG
  }
  if (!input.unsigned) {
    if (typeof input.low !== 'number' || typeof input.high !== 'number') {
      return INVALID_LONG
    }
  } else {
    return INVALID_LONG
  }
}
