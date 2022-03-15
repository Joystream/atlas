export enum AuctionDuration {
  NoExpiration = 'No expiration date',
  OneDay = '1 day',
  ThreeDays = '3 days',
  FiveDays = '5 days',
  SevenDays = '7 days',
}

export type Listing = 'Auction' | 'Fixed price' | 'Not for sale' | undefined

export type AuctionDatePickerValue =
  | {
      type: 'date'
      date: Date
    }
  | {
      type: 'duration'
      durationDays: number | null
    }
  | null

export type AuctionDate = {
  startDate: AuctionDatePickerValue
  endDate: AuctionDatePickerValue
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
