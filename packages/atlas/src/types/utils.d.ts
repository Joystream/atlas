export {}

declare global {
  type Subset<K, T extends K> = T
}
