export {}

declare global {
  type Subset<K, T extends K> = T
  type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>
  }
  type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
}
