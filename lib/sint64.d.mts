import type {
  SLongDecode,
  SLongEncode,
  SLongEncodeLength,
  SLongFixedEncode,
} from './types.mjs'

export const decode: SLongDecode
export const encode: SLongEncode
export const encodeLength: SLongEncodeLength
export const fixedEncoder: SLongFixedEncode
export const name = 'sint64'
export { validate } from './int64.mjs'
