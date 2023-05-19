type Items = 'VideoTile' | 'NftTile'

// Value should trigger loading 1,5 tile from the bottom
export const InfiniteLoadingOffsets: Record<Items, number> = {
  VideoTile: 500,
  NftTile: 600,
}
