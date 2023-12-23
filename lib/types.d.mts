export interface SLong {
  low: number
  high: number
  unsigned?: false
}
export interface ULong {
  low: number
  high: number
  unsigned: true
}
export interface Encode<InputType, Size extends number> {
  /**
   * @deprecated use fixedEncoder(...).encode()
   */
  <Target extends ArrayLike<number>>(
    input: InputType,
    target?: Target,
    offset?: number,
  ): Target
  readonly bytes: Size
}
export interface DecodeDirect<Result, Size extends number> {
  <InputType extends ArrayLike<number>>(
    input: InputType,
    offset?: number,
  ): Result
  readonly bytes: Size
}

export type NumberEncode = Encode<number, 1 | 2 | 3 | 4 | 5>
export type NumberDecode = DecodeDirect<number, 1 | 2 | 3 | 4 | 5>
export type NumberEncodeLength = EncodeLength<number, 1 | 2 | 3 | 4 | 5>
export type NumberFixedEncode = ResolveFixedEncoder<number, 1 | 2 | 3 | 4 | 5>
export type SLongEncode = Encode<SLong, 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10>
export type SLongDecode = DecodeTarget<
  SLong,
  1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
>
export type SLongEncodeLength = EncodeLength<
  SLong,
  1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
>
export type SLongFixedEncode = ResolveFixedEncoder<
  SLong,
  1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
>
export type ULongEncode = Encode<ULong, 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10>
export type ULongDecode = DecodeTarget<
  ULong,
  1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
>
export type ULongEncodeLength = EncodeLength<
  ULong,
  1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
>
export type ULongFixedEncode = ResolveFixedEncoder<
  ULong,
  1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
>

export interface DecodeTarget<Target, Size extends number> {
  <InputType extends ArrayLike<number>>(
    input: InputType,
    offset?: number,
    target?: Target,
  ): Target
  readonly bytes: Size
}
export type EncodeLength<InputType, Result extends number> = (
  input: InputType,
) => Result
export type FixedEncode<InputType> = <Target extends ArrayLike<number>>(
  input: InputType,
  target?: Target,
  offset?: number,
) => Target
export interface FixedEncoder<InputType, Size extends number> {
  encode: FixedEncode<InputType>
  readonly bytes: Size
}
export type ResolveFixedEncoder<InputType, Size extends number> = (
  input: InputType,
) => FixedEncoder<InputType, Size>
export type Validator<T extends string> = (input: any) => T | undefined
