import { SelectedAuctionOption } from '@/components/_inputs/AuctionDatePicker'

export enum AuctionDuration {
  NoExpiration = 'No expiration date',
  OneDay = '1 day',
  ThreeDays = '3 days',
  FiveDays = '5 days',
  SevenDays = '7 days',
}

export type Listing = 'Auction' | 'Fixed price' | 'Not for sale' | undefined

export type AuctionDate = {
  startDate: SelectedAuctionOption
  endDate: SelectedAuctionOption
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
