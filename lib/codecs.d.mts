import * as int32 from './int32.mjs'
import * as int64 from './int64.mjs'
import * as sint32 from './sint32.mjs'
import * as sint64 from './sint64.mjs'
import * as uint32 from './uint32.mjs'
import * as uint64 from './uint64.mjs'

export const codecs: Readonly<{
  int32: typeof int32
  int64: typeof int64
  sint32: typeof sint32
  sint64: typeof sint64
  uint32: typeof uint32
  uint64: typeof uint64
}>
