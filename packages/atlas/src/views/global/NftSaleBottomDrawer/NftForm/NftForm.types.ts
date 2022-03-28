import { BasicMembershipFieldsFragment } from '@/api/queries'
import { AuctionDatePickerValue } from '@/components/_inputs/AuctionDatePicker'
import { NftSaleInputMetadata } from '@/joystream-lib'

export type Listing = 'Auction' | 'Fixed price' | undefined

export type AuctionDate = {
  startDate: AuctionDatePickerValue
  endDate: AuctionDatePickerValue
}

export type NftFormFields = {
  royalty?: number
  startingPrice?: number
  buyNowPrice?: number | ''
  auctionDurationBlocks?: number
  whitelistedMembers?: BasicMembershipFieldsFragment[]
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
