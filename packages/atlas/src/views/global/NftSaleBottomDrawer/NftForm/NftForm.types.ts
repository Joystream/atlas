export type Listing = 'Auction' | 'Fixed price' | undefined

export enum AuctionDuration {
  NoExpiration = 'No expiration date',
  OneDay = '1 day',
  ThreeDays = '3 days',
  FiveDays = '5 days',
  SevenDays = '7 days',
}

export type StartDate = Date | string | null | 'Right after listing'
export type EndDate = Date | string | null | AuctionDuration

export type AuctionDate = {
  startDate: StartDate
  endDate: EndDate
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
