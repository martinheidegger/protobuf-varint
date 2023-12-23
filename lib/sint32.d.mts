import type {
  NumberDecode,
  NumberEncode,
  NumberEncodeLength,
  NumberFixedEncode,
} from './types.mjs'

export const decode: NumberDecode
export const encode: NumberEncode
export const encodeLength: NumberEncodeLength
export const fixedEncoder: NumberFixedEncode
export const name = 'sint32'
export { validate, MIN_VALUE, MAX_VALUE } from './int32.mjs'
