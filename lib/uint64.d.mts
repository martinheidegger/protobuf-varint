import type {
  ULongDecode,
  ULongEncode,
  ULongEncodeLength,
  ULongFixedEncode,
  Validator,
} from './types.mjs'

export const decode: ULongDecode
export const encode: ULongEncode
export const encodeLength: ULongEncodeLength
export const fixedEncoder: ULongFixedEncode
export const name = 'uint64'
export const validate: Validator<string>
