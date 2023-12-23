import {
  INT32_TOO_LARGE,
  INT32_TOO_SMALL,
  NAN,
  INVALID_NUMBER,
  NUMBER_FLOATING_POINT,
} from './errors.mjs'
import { fixedEncoders as fixedUint, B1, B2, B3, B4 } from './uint32.mjs'

export const name = 'int32'

export const MIN_VALUE = -0b10000000000000000000000000000000
export const MAX_VALUE = 0b01111111111111111111111111111111

const MSB = 0b10000000
const REST = 0b01111111
const POS = 0b0111
const NEG = 0b1000

export function decode(bytes, offset = 0) {
  let b = bytes[offset]
  if (!(b & MSB)) {
    decode.bytes = 1
    return b
  }
  let result = b & REST
  b = bytes[offset + 1]
  if (!(b & MSB)) {
    decode.bytes = 2
    return result | (b << 7)
  }
  result |= (b & REST) << 7
  b = bytes[offset + 2]
  if (!(b & MSB)) {
    decode.bytes = 3
    return result | (b << 14)
  }
  result |= (b & REST) << 14
  b = bytes[offset + 3]
  if (!(b & MSB)) {
    decode.bytes = 4
    return result | (b << 21)
  }
  result |= (b & REST) << 21
  b = bytes[offset + 4]
  decode.bytes = 5
  return result + (b & POS) * 0x10000000 - (b & NEG) * 0x10000000
}
decode.bytes = 1

export function encode(int32, target, offset) {
  const { bytes, encode: fixEncode } = fixedEncoder(int32)
  encode.bytes = bytes
  return fixEncode(int32, target, offset)
}
encode.bytes = 1

export function encodeLength(int32) {
  return fixedEncoder(int32).bytes
}

const NE = 0x100000000

const [p1, p2, p3, p4, p5] = fixedUint
const p5encode = p5.encode
const neg = Object.freeze({
  bytes: 5,
  encode(int, out, offset) {
    return p5encode(NE + int, out, offset)
  },
})

export const fixedEncoder = (int) =>
  int < 0
    ? neg
    : int & B4
      ? p5
      : int & B3
        ? p4
        : int & B2
          ? p3
          : int & B1
            ? p2
            : p1

export function validate(input) {
  if (typeof input !== 'number') return INVALID_NUMBER
  if (isNaN(input)) return NAN
  if (input < MIN_VALUE) return INT32_TOO_SMALL
  if (input > MAX_VALUE) return INT32_TOO_LARGE
  if (input !== (input | 0)) return NUMBER_FLOATING_POINT
}
