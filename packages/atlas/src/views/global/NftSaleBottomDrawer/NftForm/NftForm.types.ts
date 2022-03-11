export type Listing = 'Auction' | 'Fixed price' | undefined

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

export type NftFormStatus = {
  isValid: boolean
  isDisabled: boolean
  canGoBack: boolean
  canGoForward: boolean
  triggerGoBack: () => void
  triggerGoForward: () => void
  triggerSubmit: () => void
}
