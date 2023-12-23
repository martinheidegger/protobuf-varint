import type {
  NumberDecode,
  NumberEncode,
  NumberEncodeLength,
  NumberFixedEncode,
  Validator,
} from './types.mjs'

export const decode: NumberDecode
export const encode: NumberEncode
export const encodeLength: NumberEncodeLength
export const fixedEncoder: NumberFixedEncode
export const name = 'int32'
export const validate: Validator<string>
export const MIN_VALUE = -0b10000000000000000000000000000000
export const MAX_VALUE = 0b01111111111111111111111111111111
