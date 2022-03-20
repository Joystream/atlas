import { BasicMembershipFieldsFragment } from '@/api/queries'
import { AuctionDatePickerValue } from '@/components/_inputs/AuctionDatePicker'
import { NftSaleInputMetadata } from '@/joystream-lib'

export enum AuctionDuration {
  NoExpiration = 'No expiration date',
  OneDay = '1 day',
  ThreeDays = '3 days',
  FiveDays = '5 days',
  SevenDays = '7 days',
}

export type Listing = 'Auction' | 'Fixed price' | undefined

export type AuctionDate = {
  startDate: AuctionDatePickerValue
  endDate: AuctionDatePickerValue
}

export type NftFormFields = {
  royalty?: number
  startingPrice?: number
  buyNowPrice?: number
  auctionDurationBlocks?: number
  whitelistedMembers?: BasicMembershipFieldsFragment[] // to be used later
} & AuctionDate

export type NftFormData = NftSaleInputMetadata

export type NftFormStatus = {
  isValid: boolean
  isDisabled: boolean
  canGoBack: boolean
  canGoForward: boolean
  triggerGoBack: () => void
  triggerGoForward: () => void
  triggerSubmit: () => void
}
