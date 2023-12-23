import type {
  Validator,
  NumberFixedEncode,
  NumberEncode,
  NumberEncodeLength,
  NumberDecode,
} from './types.mjs'

export const decode: NumberDecode
export const encode: NumberEncode
export const encodeLength: NumberEncodeLength
export const fixedEncoder: NumberFixedEncode
export const name = 'uint32'
export const validate: Validator<string>
export const MIN_VALUE = 0b00000000000000000000000000000000
export const MAX_VALUE = 0b11111111111111111111111111111111
