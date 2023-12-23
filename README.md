# protobuf-varint

⚡️

Fast encoding and decoding for all variable [protobuf varint types](https://developers.google.com/protocol-buffers/docs/encoding#varints).

- Supports 64bit values using `longfn` or `long.js` compatible objects.
- Protocol-buffer compatible for **all** edge cases
- Codecs for all types: `int32`, `sint32`, `uint32`, `int64`, `sint64` and `uint64`
- Pure JavaScript
- No dependencies
- TypeScript declaration files 😉

## Usage

### Encoding

```js
import { uint64 } from 'protobuf-varint'
import { fromBigInt } from 'longfn'

// You can use numbers for the whole uint64 range with the longfn
// lib to be easily created from a variety of formats
const long = fromBigInt(0xffffffffffffffffn)

const fixedEncoder = uint64.fixedEncoder(long)
const buffer = new Uint8Array(
  fixedEncoder.bytes, // The fixedEncoder containst the size needed to write the var-int
)
fixedEncoder.encode(long, buffer, 0) // Profit!
```

### Decoding

```js
// Use a operation object to reduce memory consumption
const target = { low: 0, high: 0, unsigned: false }
uint64.decode(buffer, 0, target)
// `target` now contains the value from the buffer!

uint64.decode.bytes // amount of bytes that were previously read
```

### Backwards Compatibility

Other encoding systems tend to use the `encode` and `encodeLength` functions
to encode content. This is discouraged because there is nearly no use-case for
`encode` on its own. `fixedEncoder` removes the need for a set of preconditions
checks that would need to be done twice, still you can use `encode` and `encodeLength`
as with others.

```js
import { encode, encodeLength } from 'protobuf-varint/sint32'

// Note this is deprecated! Use `fixedEncoder`!

const int32 = -1311313
const buffer = new Uint8Array(encodeLength(int32))
encode(int32, buffer, 0)
```

### Flexible Partial Access

Depending on your usage you can choose different variants matching your needs.

```js
import { uint64 } from 'protobuf-varint'
import * as int32 from 'protobuf-varint/int32'
import { fixedEncoder } from 'protobuf-varint/sint64'
import { decode as decodeSInt32 } from 'protobuf-varint/sint32'
import { decode as decodeSInt64 } from 'protobuf-varint/sint64'
import { codecs } from 'protobuf-varint'
codecs.int64
```

# License

[MIT](./LICENSE)
