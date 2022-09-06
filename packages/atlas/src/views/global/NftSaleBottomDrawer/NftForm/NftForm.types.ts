import BN from 'bn.js'

import { BasicMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { AuctionDatePickerValue } from '@/components/_inputs/AuctionDatePicker'
import { NftSaleInputMetadata } from '@/joystream-lib/types'

export type Listing = 'Auction' | 'Fixed price' | undefined

export type AuctionDate = {
  startDate: AuctionDatePickerValue
  endDate: AuctionDatePickerValue
}

export type NftFormFields = {
  type: 'open' | 'english' | 'buyNow'
  royalty?: number
  startingPrice?: number
  buyNowPrice?: number
  auctionDurationBlocks?: number
  whitelistedMembers?: BasicMembershipFieldsFragment[]
} & AuctionDate

export type NftFormData = NftSaleInputMetadata

export type NftFormStatus = {
  isValid: boolean
  canGoBack: boolean
  canGoForward: boolean
  actionBarFee?: BN
  actionBarLoading?: boolean
  triggerGoBack: () => void
  triggerGoForward: () => void
  triggerSubmit: () => void
}
