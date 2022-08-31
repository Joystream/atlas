// this is needed because of a bug in Vite - it will not include WASM referenced from workers in the bundle, see https://github.com/vitejs/vite/issues/5699
import 'blake3/dist/wasm/web/blake3_js_bg.wasm'

import { createId } from '@/utils/createId'

import type { HashingRequest, HashingResponse } from './worker'

const worker = new Worker(new URL('./worker', import.meta.url), {
  type: 'module',
})

const promiseResolveMap: Record<string, (hash: string) => void> = {}

export const computeFileHash = async (file: File | Blob): Promise<string> => {
  // create unique id for each file, so we know which response is which
  const hashingId = createId()

  const promise = new Promise<string>((resolve) => {
    promiseResolveMap[hashingId] = resolve
  })

  const hashingRequest: HashingRequest = {
    hashingId,
    file,
  }
  worker.postMessage(hashingRequest)

  return promise
}

worker.onmessage = ({ data }) => {
  const hashingResponse = data as HashingResponse
  const promiseResolve = promiseResolveMap[hashingResponse.hashingId]
  promiseResolve(hashingResponse.hash)
}
