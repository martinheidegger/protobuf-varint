import {
  INVALID_NUMBER,
  NAN,
  NUMBER_FLOATING_POINT,
  NUMBER_NEGATIVE,
  UINT32_TOO_LARGE,
} from './errors.mjs'

export const name = 'uint32'

export const MIN_VALUE = 0b00000000000000000000000000000000
export const MAX_VALUE = 0b11111111111111111111111111111111

const MSB = 0b10000000
const REST = 0b01111111

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
  decode.bytes = 5
  return (result | ((b & REST) << 21)) + bytes[offset + 4] * 0x10000000
}
decode.bytes = 1

export function encode(uint32, target, offset) {
  const { bytes, encode: fixEncode } = fixedEncoder(uint32)
  encode.bytes = bytes
  return fixEncode(uint32, target, offset)
}
encode.bytes = 1

export function encodeLength(uint32) {
  return fixedEncoder(uint32).bytes
}

export const B4 = 0b11110000000000000000000000000000
export const B3 = 0b00001111111000000000000000000000
export const B2 = 0b00000000000111111100000000000000
export const B1 = 0b00000000000000000011111110000000
export const B0 = 0b00000000000000000000000001111111

export const fixedEncoders = [
  {
    bytes: 1,
    encode(int, out = [], offset = 0) {
      out[offset] = int
      return out
    },
  },
  {
    bytes: 2,
    encode(int, out = [], offset = 0) {
      out[offset] = (int & B0) | MSB
      out[offset + 1] = (int & B1) >> 7
      return out
    },
  },
  {
    bytes: 3,
    encode(int, out = [], offset = 0) {
      out[offset] = (int & B0) | MSB
      out[offset + 1] = ((int & B1) >> 7) | MSB
      out[offset + 2] = (int & B2) >> 14
      return out
    },
  },
  {
    bytes: 4,
    encode(int, out = [], offset = 0) {
      out[offset] = (int & B0) | MSB
      out[offset + 1] = ((int & B1) >> 7) | MSB
      out[offset + 2] = ((int & B2) >> 14) | MSB
      out[offset + 3] = (int & B3) >> 21
      return out
    },
  },
  {
    bytes: 5,
    encode(int, out = [], offset = 0) {
      out[offset] = (int & B0) | MSB
      out[offset + 1] = ((int & B1) >> 7) | MSB
      out[offset + 2] = ((int & B2) >> 14) | MSB
      out[offset + 3] = ((int & B3) >> 21) | MSB
      out[offset + 4] = int >>> 28
      return out
    },
  },
].map(Object.freeze)

const [e1, e2, e3, e4, e5] = fixedEncoders

export const fixedEncoder = (input) =>
  input & B4 ? e5 : input & B3 ? e4 : input & B2 ? e3 : input & B1 ? e2 : e1

export function validate(input) {
  if (typeof input !== 'number') return INVALID_NUMBER
  if (isNaN(input)) return NAN
  if (input < MIN_VALUE) return NUMBER_NEGATIVE
  if (input > MAX_VALUE) return UINT32_TOO_LARGE
  if (input !== (input | 0)) return NUMBER_FLOATING_POINT
}
