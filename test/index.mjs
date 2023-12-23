import { codecs } from '../lib/index.mjs'
import { test } from 'node:test'
import { fixtures } from './fixtures.mjs'
import * as assert from 'node:assert'

export const TWO_PWR_16_DBL = 1 << 16
export const TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL

test('initial bytes', async () => {
  for (const codec of Object.values(codecs)) {
    assert.equal(
      codec.decode.bytes,
      1,
      `initial bytes = 1; ${codec.name}.decode`,
    )
    assert.equal(
      codec.encode.bytes,
      1,
      `initial bytes = 1; ${codec.name}.encode`,
    )
  }
})

function reverseStr(string) {
  return Array.from(string).reverse().join('')
}

function numFormatBinary(num) {
  let prefix = ' 0b'
  if (num < 0) {
    prefix = '-0b'
    num *= typeof num === 'bigint' ? -1n : -1
  }
  return (
    prefix +
    reverseStr(
      reverseStr(num.toString(2).padStart(64, '0'))
        .match(/.{1,7}/g)
        .join('_'),
    ) +
    (typeof num === 'bigint' ? 'n' : ' ')
  )
}

const bformat = (num) => '0b' + num.toString(2).padStart(8, '0')

const codecsByNumType = {
  num: [codecs.uint32, codecs.int32, codecs.sint32],
  ulong: [codecs.uint64],
  long: [codecs.int64, codecs.sint64],
}
for (const [numType, codecs] of Object.entries(codecsByNumType)) {
  for (const codec of codecs) {
    let first = true
    const name = codec.name.padStart(6, ' ')
    for (const [index, fixture] of fixtures.entries()) {
      const input = fixture[numType]
      if (input === undefined) {
        continue
      }
      const indexStr = ('#' + index).padStart(3, ' ')
      const numStr = numFormatBinary(fixture.num ?? fixture.big)
      test(`${name} | ${indexStr} | ${numStr}`, async () => {
        const encoder = codec.fixedEncoder(input)
        const expected = fixture[codec.name]
        if (expected === undefined) {
          throw new assert.AssertionError(
            `${codec.name}: ${fixture.num} - no expected value`,
          )
        }
        if (first) {
          first = false
          const target = new Uint8Array(expected.length)
          codec.encode(input, target)
        }
        if (typeof expected === 'string' || typeof input === 'string') {
          if (typeof input === 'string') {
            assert.equal(input, expected, 'invalid')
          } else {
            assert.equal(codec.validate(input), expected, 'invalid')
          }
        } else {
          const encoded = codec.encode(input)
          assert.deepEqual(
            encoded,
            expected,
            `encoded \n${encoded.map(bformat)} != \n${expected.map(bformat)}`,
          )
          assert.equal(
            codec.encode.bytes,
            expected.length,
            `encoder.bytes ${codec.encode.bytes} != ${expected.length}`,
          )
          const encodeLen = codec.encodeLength(input)
          assert.equal(
            encodeLen,
            expected.length,
            `encodeLength(num) = ${encodeLen} != ${expected.lenth} `,
          )
          assert.equal(
            encoder.bytes,
            expected.length,
            'fixedEncoder length matches',
          )
          assert.deepEqual(
            encoder.encode(input),
            expected,
            'fixedEncoder matches expected',
          )
          assert.equal(
            encoder.bytes,
            expected.length,
            'fixedEncoder length still matches',
          )
          assert.equal(encoder.bytes, expected.length, 'encoder is fixed')
          const decoded = codec.decode(expected)
          assert.equal(
            codec.decode.bytes,
            expected.length,
            'decoded.bytes matches expected',
          )
          assert.deepEqual(decoded, input, 'decoded matches expected')
        }
      })
    }
  }
}
