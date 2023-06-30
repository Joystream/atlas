import BN from 'bn.js'

import { BasicBidFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { EnglishTimerState } from '@/hooks/useNftState'

export type Auction = {
  status: 'auction'
  type: 'open' | 'english'
  startingPrice: BN
  buyNowPrice: BN | undefined
  topBid: BasicBidFieldsFragment | undefined
  topBidAmount: BN | undefined
  topBidderHandle: string | undefined
  topBidderAvatarUris: string[] | null | undefined
  isUserTopBidder: boolean | undefined
  userBidAmount: BN | undefined
  userBidUnlockDate: Date | undefined
  canWithdrawBid: boolean | undefined
  canChangeBid: boolean | undefined
  hasTimersLoaded: boolean | undefined
  englishTimerState: EnglishTimerState | undefined
  auctionPlannedEndDate: Date | undefined
  startsAtDate: Date | undefined
  plannedEndAtBlock: number | null | undefined
  startsAtBlock: number | null | undefined
  auctionBeginsInDays: number
  auctionBeginsInSeconds: number
  isUserWhitelisted: boolean | undefined
}

export type NftWidgetStatus =
  | {
      status: 'idle'
      lastSalePrice: BN | undefined
      lastSaleDate: Date | undefined
    }
  | {
      status: 'buy-now'
      buyNowPrice: BN
    }
  | Auction
