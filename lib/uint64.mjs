import { INVALID_LONG } from './errors.mjs'

export const name = 'uint64'

const MSB = 0b10000000
const REST = 0b01111111

export function decode(
  bytes,
  offset = 0,
  long = { low: 0, high: 0, unsigned: true },
) {
  let b = bytes[offset]
  if (!(b & MSB)) {
    long.low = b
    long.high = 0
    decode.bytes = 1
    return long
  }
  let lo = b & REST
  b = bytes[offset + 1]
  if (!(b & MSB)) {
    long.low = lo | (b << 7)
    long.high = 0
    decode.bytes = 2
    return long
  }
  lo |= (b & REST) << 7
  b = bytes[offset + 2]
  if (!(b & MSB)) {
    long.low = lo | (b << 14)
    long.high = 0
    decode.bytes = 3
    return long
  }
  lo |= (b & REST) << 14
  b = bytes[offset + 3]
  if (!(b & MSB)) {
    long.low = lo | (b << 21)
    long.high = 0
    decode.bytes = 4
    return long
  }
  lo |= (b & REST) << 21
  b = bytes[offset + 4]
  long.low = (lo + b * 0x10000000) | 0
  if (!(b & MSB)) {
    long.high = b >> 4
    decode.bytes = 5
    return long
  }
  let hi = (b & REST) >> 4
  b = bytes[offset + 5]
  if (!(b & MSB)) {
    long.high = hi | (b << 3)
    decode.bytes = 6
    return long
  }
  hi |= (b & REST) << 3
  b = bytes[offset + 6]
  if (!(b & MSB)) {
    long.high = hi | (b << 10)
    decode.bytes = 7
    return long
  }
  hi |= (b & REST) << 10
  b = bytes[offset + 7]
  if (!(b & MSB)) {
    long.high = hi | (b << 17)
    decode.bytes = 8
    return long
  }
  hi |= (b & REST) << 17
  b = bytes[offset + 8]
  long.high = hi | (b * 0x1000000) | 0
  decode.bytes = b & MSB ? 10 : 9
  return long
}
decode.bytes = 1

export function encode(ulong, target, offset) {
  const { bytes, encode: fixEncode } = fixedEncoder(ulong)
  encode.bytes = bytes
  return fixEncode(ulong, target, offset)
}
encode.bytes = 1

export function encodeLength(ulong) {
  return fixedEncoder(ulong).bytes
}

export const LO0 = 0b00000000_00000000_00000000_01111111
export const LO1 = 0b00000000_00000000_00111111_10000000
export const LO2 = 0b00000000_00011111_11000000_00000000
export const LO3 = 0b00001111_11100000_00000000_00000000
export const LO4 = 0b11110000_00000000_00000000_00000000
export const HI0 = 0b00000000_00000000_00000000_00000111
export const HI1 = 0b00000000_00000000_00000011_11111000
export const HI2 = 0b00000000_00000001_11111100_00000000
export const HI3 = 0b00000000_11111110_00000000_00000000
export const HI4 = 0b01111111_00000000_00000000_00000000
export const HI5 = 0b10000000_00000000_00000000_00000000

export const fixedEncoders = [
  {
    bytes: 1,
    encode(long, out = [], offset = 0) {
      out[offset] = long.low
      return out
    },
  },
  {
    bytes: 2,
    encode(long, out = [], offset = 0) {
      const { low } = long
      out[offset] = (low & LO0) | MSB
      out[offset + 1] = low >>> 7
      return out
    },
  },
  {
    bytes: 3,
    encode(long, out = [], offset = 0) {
      const { low } = long
      out[offset] = (low & LO0) | MSB
      out[offset + 1] = ((low >>> 7) & LO0) | MSB
      out[offset + 2] = low >>> 14
      return out
    },
  },
  {
    bytes: 4,
    encode(long, out = [], offset = 0) {
      const { low } = long
      out[offset] = (low & LO0) | MSB
      out[offset + 1] = ((low >>> 7) & LO0) | MSB
      out[offset + 2] = ((low >>> 14) & LO0) | MSB
      out[offset + 3] = (low >>> 21) & LO0
      return out
    },
  },
  {
    bytes: 5,
    encode(long, out = [], offset = 0) {
      const { low, high } = long
      out[offset] = (low & LO0) | MSB
      out[offset + 1] = ((low >>> 7) & LO0) | MSB
      out[offset + 2] = ((low >>> 14) & LO0) | MSB
      out[offset + 3] = ((low >>> 21) & LO0) | MSB
      out[offset + 4] = ((high << 4) | (low >>> 28)) & LO0
      return out
    },
  },
  {
    bytes: 6,
    encode(long, out = [], offset = 0) {
      const { low, high } = long
      out[offset] = (low & LO0) | MSB
      out[offset + 1] = ((low >>> 7) & LO0) | MSB
      out[offset + 2] = ((low >>> 14) & LO0) | MSB
      out[offset + 3] = ((low >>> 21) & LO0) | MSB
      out[offset + 4] = ((high & HI0) << 4) | (low >>> 28) | MSB
      out[offset + 5] = (high >>> 3) & LO0
      return out
    },
  },
  {
    bytes: 7,
    encode(long, out = [], offset = 0) {
      const { low, high } = long
      out[offset] = (low & LO0) | MSB
      out[offset + 1] = ((low >>> 7) & LO0) | MSB
      out[offset + 2] = ((low >>> 14) & LO0) | MSB
      out[offset + 3] = ((low >>> 21) & LO0) | MSB
      out[offset + 4] = ((high & HI0) << 4) | (low >>> 28) | MSB
      out[offset + 5] = ((high >>> 3) & LO0) | MSB
      out[offset + 6] = high >>> 10
      return out
    },
  },
  {
    bytes: 8,
    encode(long, out = [], offset = 0) {
      const { low, high } = long
      out[offset] = (low & LO0) | MSB
      out[offset + 1] = ((low >>> 7) & LO0) | MSB
      out[offset + 2] = ((low >>> 14) & LO0) | MSB
      out[offset + 3] = ((low >>> 21) & LO0) | MSB
      out[offset + 4] = ((high & HI0) << 4) | (low >>> 28) | MSB
      out[offset + 5] = ((high >>> 3) & LO0) | MSB
      out[offset + 6] = ((high >>> 10) & LO0) | MSB
      out[offset + 7] = (high >>> 17) & LO0
      return out
    },
  },
  {
    bytes: 9,
    encode(long, out = [], offset = 0) {
      const { low, high } = long
      out[offset] = (low & LO0) | MSB
      out[offset + 1] = ((low >>> 7) & LO0) | MSB
      out[offset + 2] = ((low >>> 14) & LO0) | MSB
      out[offset + 3] = ((low >>> 21) & LO0) | MSB
      out[offset + 4] = ((high & HI0) << 4) | (low >>> 28) | MSB
      out[offset + 5] = ((high >>> 3) & LO0) | MSB
      out[offset + 6] = ((high >>> 10) & LO0) | MSB
      out[offset + 7] = ((high >>> 17) & LO0) | MSB
      out[offset + 8] = high >>> 24
      return out
    },
  },
  {
    bytes: 10,
    encode(long, out = [], offset = 0) {
      const { low, high } = long
      out[offset] = (low & LO0) | MSB
      out[offset + 1] = ((low >>> 7) & LO0) | MSB
      out[offset + 2] = ((low >>> 14) & LO0) | MSB
      out[offset + 3] = ((low >>> 21) & LO0) | MSB
      out[offset + 4] = ((high & HI0) << 4) | (low >>> 28) | MSB
      out[offset + 5] = ((high >>> 3) & LO0) | MSB
      out[offset + 6] = ((high >>> 10) & LO0) | MSB
      out[offset + 7] = ((high >>> 17) & LO0) | MSB
      out[offset + 8] = (high >>> 24) | MSB
      out[offset + 9] = 1
      return out
    },
  },
].map(Object.freeze)

const [e1, e2, e3, e4, e5, e6, e7, e8, e9, e10] = fixedEncoders

export function fixedEncoder(input) {
  const { low, high } = input
  return high & HI5
    ? e10
    : high & HI4
      ? e9
      : high & HI3
        ? e8
        : high & HI2
          ? e7
          : high & HI1
            ? e6
            : high & HI0 || low & LO4
              ? e5
              : low & LO3
                ? e4
                : low & LO2
                  ? e3
                  : low & LO1
                    ? e2
                    : e1
}

export function validate(long) {
  if (typeof long != 'object' || long === null) {
    return INVALID_LONG
  }
  if (!!long.unsigned) {
    if (typeof long.low !== 'number' || typeof long.high !== 'number') {
      return INVALID_LONG
    }
  } else {
    return INVALID_LONG
  }
}
