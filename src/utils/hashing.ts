import loadBlake3 from 'blake3/browser-async'
import loadBlake3Wasm from 'blake3/dist/wasm/web/blake3_js_bg.wasm'
import { encode as encodeHash, toB58String } from 'multihashes'

type Blake3 = Awaited<ReturnType<typeof loadBlake3>>
let blake3: Blake3

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

export const computeFileHash = async (file: File | Blob): Promise<string> => {
  const { createHash } = await getBlake3()
  const hash = createHash()

  const reader = file.stream().getReader()
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { value, done } = await reader.read()
    if (done) {
      break
    }
    hash.update(value)
  }

  const digest = hash.digest()
  return toB58String(encodeHash(digest, 'blake3'))
}
