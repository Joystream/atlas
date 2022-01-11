import { blake3 } from '@noble/hashes/blake3'
import { encode as encodeHash, toB58String } from 'multihashes'

export const computeFileHash = async (file: File | Blob): Promise<string> => {
  const fileBuffer = await file.arrayBuffer()
  const digest = blake3(new Uint8Array(fileBuffer))
  return toB58String(encodeHash(digest, 'blake3'))
}
