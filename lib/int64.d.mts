import type {
  SLongDecode,
  SLongEncode,
  SLongEncodeLength,
  SLongFixedEncode,
  Validator,
} from './types.mjs'

export const decode: SLongDecode
export const encode: SLongEncode
export const encodeLength: SLongEncodeLength
export const fixedEncoder: SLongFixedEncode
export const name = 'int64'
export const validate: Validator<string>
