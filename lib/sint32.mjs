export { validate, MIN_VALUE, MAX_VALUE } from './int32.mjs'

export const name = 'sint32'

const MSB = 0b10000000
const NSB = 0b10000001
const FIRST = 0b01111110
const REST = 0b01111111

export const B4 = 0b01111000000000000000000000000000
export const B3 = 0b00000111111100000000000000000000
export const B2 = 0b00000000000011111110000000000000
export const B1 = 0b00000000000000000001111111000000
export const B0 = 0b00000000000000000000000000111111

export function decode(bytes, offset = 0) {
  let b = bytes[offset]
  const n = -(b & 1)
  if (!(b & MSB)) {
    decode.bytes = 1
    return ((b & FIRST) >> 1) ^ n
  }
  let result = (b & FIRST) >> 1
  b = bytes[offset + 1]
  if (!(b & MSB)) {
    decode.bytes = 2
    return (result | (b << 6)) ^ n
  }
  result |= (b & REST) << 6
  b = bytes[offset + 2]
  if (!(b & MSB)) {
    decode.bytes = 3
    return (result | (b << 13)) ^ n
  }
  result |= (b & REST) << 13
  b = bytes[offset + 3]
  if (!(b & MSB)) {
    decode.bytes = 4
    return (result | (b << 20)) ^ n
  }
  decode.bytes = 5
  return ((result | ((b & REST) << 20)) + bytes[offset + 4] * 0x8000000) ^ n
}
decode.bytes = 1

export function encodeLength(int32) {
  return fixedEncoder(int32).bytes
}

export function encode(int32, target, offset) {
  const { bytes, encode: fixEncode } = fixedEncoder(int32)
  encode.bytes = bytes
  return fixEncode(int32, target, offset)
}
encode.bytes = 1

export const fixedEncoders = [
  {
    bytes: 1,
    encode(int, out = [], offset = 0) {
      out[offset] = int << 1
      return out
    },
  },
  {
    bytes: 2,
    encode(int, out = [], offset = 0) {
      out[offset] = ((int & B0) << 1) | MSB
      out[offset + 1] = (int & B1) >> 6
      return out
    },
  },
  {
    bytes: 3,
    encode(int, out = [], offset = 0) {
      out[offset] = ((int & B0) << 1) | MSB
      out[offset + 1] = ((int & B1) >> 6) | MSB
      out[offset + 2] = (int & B2) >> 13
      return out
    },
  },
  {
    bytes: 4,
    encode(int, out = [], offset = 0) {
      out[offset] = ((int & B0) << 1) | MSB
      out[offset + 1] = ((int & B1) >> 6) | MSB
      out[offset + 2] = ((int & B2) >> 13) | MSB
      out[offset + 3] = (int & B3) >> 20
      return out
    },
  },
  {
    bytes: 5,
    encode(int, out = [], offset = 0) {
      out[offset] = ((int & B0) << 1) | MSB
      out[offset + 1] = ((int & B1) >> 6) | MSB
      out[offset + 2] = ((int & B2) >> 13) | MSB
      out[offset + 3] = ((int & B3) >> 20) | MSB
      out[offset + 4] = int >>> 27
      return out
    },
  },
  {
    bytes: 1,
    encode(int, out = [], offset = 0) {
      out[offset] = (int << 1) ^ -1
      return out
    },
  },
  {
    bytes: 2,
    encode(int, out = [], offset = 0) {
      int = ~int
      out[offset] = ((int & B0) << 1) | NSB
      out[offset + 1] = (int & B1) >> 6
      return out
    },
  },
  {
    bytes: 3,
    encode(int, out = [], offset = 0) {
      int = ~int
      out[offset] = ((int & B0) << 1) | NSB
      out[offset + 1] = ((int & B1) >> 6) | MSB
      out[offset + 2] = (int & B2) >> 13
      return out
    },
  },
  {
    bytes: 4,
    encode(int, out = [], offset = 0) {
      int = ~int
      out[offset] = ((int & B0) << 1) | NSB
      out[offset + 1] = ((int & B1) >> 6) | MSB
      out[offset + 2] = ((int & B2) >> 13) | MSB
      out[offset + 3] = (int & B3) >> 20
      return out
    },
  },
  {
    bytes: 5,
    encode(int, out = [], offset = 0) {
      int = ~int
      out[offset] = ((int & B0) << 1) | NSB
      out[offset + 1] = ((int & B1) >> 6) | MSB
      out[offset + 2] = ((int & B2) >> 13) | MSB
      out[offset + 3] = ((int & B3) >> 20) | MSB
      out[offset + 4] = int >>> 27
      return out
    },
  },
].map(Object.freeze)

const [p1, p2, p3, p4, p5, n1, n2, n3, n4, n5] = fixedEncoders

export function fixedEncoder(int) {
  if (int < 0) {
    int = ~int
    return int & B4 ? n5 : int & B3 ? n4 : int & B2 ? n3 : int & B1 ? n2 : n1
  } else {
    return int & B4 ? p5 : int & B3 ? p4 : int & B2 ? p3 : int & B1 ? p2 : p1
  }
}
