import { NftAuctionInputMetadata, NftIssuanceInputMetadata } from '@/joystream-lib'

export type Listing = 'Auction' | 'Fixed price' | 'Not for sale' | undefined

export type AuctionDate = {
  startDate: Date | string | null
  endDate: Date | string | null
}

export type NFTFormData = NftAuctionInputMetadata & NftIssuanceInputMetadata & AuctionDate
