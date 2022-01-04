import IpfsHash from 'ipfs-only-hash'

const DEFAULT_CHUNK_SIZE = 128 * 1024 * 1024 // 128 MB

const createIterableFile = (file: File | Blob, chunkSize: number): AsyncIterable<Uint8Array> => {
  async function* iterator(): AsyncIterator<Uint8Array> {
    let offset = 0
    let fileSlice
    let result

    while (offset < file.size) {
      fileSlice = file.slice(offset, chunkSize + offset)
      offset += chunkSize
      result = await fileSlice.arrayBuffer()
      yield new Uint8Array(result)
    }
  }

  return {
    [Symbol.asyncIterator]: iterator,
  }
}

export const computeFileHash = async (file: File | Blob, chunkSize = DEFAULT_CHUNK_SIZE): Promise<string> => {
  const iterableFile = createIterableFile(file, chunkSize)
  return await IpfsHash.of(iterableFile, { cidVersion: 0 })
}
