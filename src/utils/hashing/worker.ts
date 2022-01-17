import loadBlake3 from 'blake3/browser-async'
import loadBlake3Wasm from 'blake3/dist/wasm/web/blake3_js_bg.wasm'
import { encode as encodeHash, toB58String } from 'multihashes'

type Blake3 = Awaited<ReturnType<typeof loadBlake3>>
let blake3: Blake3

const CHUNK_SIZE = 1024 * 1024 * 128

export type HashingRequest = {
  hashingId: string
  file: File | Blob
}

export type HashingResponse = {
  hashingId: string
  hash: string
}

const createIterableFile = (file: File | Blob): AsyncIterable<Uint8Array> => {
  async function* iterator(): AsyncIterator<Uint8Array> {
    let offset = 0
    let fileSlice
    let result

    while (offset < file.size) {
      fileSlice = file.slice(offset, CHUNK_SIZE + offset)
      offset += CHUNK_SIZE
      result = await fileSlice.arrayBuffer()
      yield new Uint8Array(result)
    }
  }

  return {
    [Symbol.asyncIterator]: iterator,
  }
}

const getBlake3 = async (): Promise<Blake3> => {
  if (blake3) return blake3

  const blake3Init = async (imports: unknown) => {
    // @ts-ignore library provides typing for the wasm module but Vite WASM helper returns something else
    const exports = await loadBlake3Wasm(imports)
    return {
      instance: { exports },
      module: {},
    }
  }

  blake3 = await loadBlake3(blake3Init)
  return blake3
}

const computeFileHash = async (file: File | Blob): Promise<string> => {
  const { createHash } = await getBlake3()
  const hash = createHash()

  const iterableFile = createIterableFile(file)
  for await (const chunk of iterableFile) {
    hash.update(chunk)
  }

  const digest = hash.digest()
  return toB58String(encodeHash(digest, 'blake3'))
}

onmessage = async ({ data }) => {
  const hashingRequest = data as HashingRequest
  const hash = await computeFileHash(data.file)
  const response: HashingResponse = {
    hashingId: hashingRequest.hashingId,
    hash: hash,
  }
  postMessage(response)
}
