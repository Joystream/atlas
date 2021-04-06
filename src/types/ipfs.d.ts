declare module 'ipfs-only-hash' {
  function of(
    content: string | Uint8Array | AsyncIterable<Uint8Array>,
    options?: { cidVersion: 0 | 1 }
  ): Promise<string>
}
