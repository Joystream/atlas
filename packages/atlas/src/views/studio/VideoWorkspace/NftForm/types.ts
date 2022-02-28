export type Listing = 'Auction' | 'Fixed price' | 'Not for sale' | undefined

export type AuctionDate = {
  startDate: Date | string | null
  endDate: Date | string | null
}

export type NftFormData = {
  royalty?: number
  startingPrice?: number
  buyNowPrice?: number
  whitelistedMembersIds?: string[] // to be used later
  auctionDurationBlocks?: number
} & AuctionDate
