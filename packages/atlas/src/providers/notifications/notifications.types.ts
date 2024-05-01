import BN from 'bn.js'

import { NetworkUtilsContextValue } from '@/providers/networkUtils/networkUtils.type'

export type NotificationRecord = { id: string; date: Date; read: boolean } & NotificationData
export type NotificationRefetchActionType<T extends keyof NetworkUtilsContextValue> = {
  name: T
  args: Parameters<NetworkUtilsContextValue[T]>
}
export type NotificationData =
  // Members
  | { type: 'ChannelCreated'; channelId: string; channelTitle: string; refetchAction: undefined }
  | {
      type: 'CommentReply' | 'ReactionToComment'
      memberId: string
      memberHandle: string
      videoId: string
      videoTitle: string
      commentId: string
      refetchAction: undefined
    }
  | {
      type: 'VideoPosted' | 'NewNftOnSale' | 'NewAuction'
      channelId: string
      channelTitle: string
      videoId: string
      videoTitle: string
      refetchAction: undefined
    }
  | {
      type: 'HigherBidPlaced'
      newBidderId: string
      newBidderHandle: string
      videoId: string
      videoTitle: string
      refetchAction: undefined
    }
  | {
      type: 'AuctionWon' | 'AuctionLost'
      auction: AuctionType
      videoId: string
      videoTitle: string
      // we only need it to be defined in one place for TS to be satisfied in notifications.hooks.ts
      refetchAction: NotificationRefetchActionType<'refetchNftData'>
    }

  // Channels
  | { type: 'ChannelExcluded'; refetchAction: undefined }
  | { type: 'ChannelFundsWithdrawn'; amount: BN; refetchAction: undefined }
  | { type: 'ChannelSuspended'; refetchAction: undefined }
  | { type: 'ChannelVerified'; refetchAction: undefined }
  | {
      type: 'CommentPostedToVideo'
      memberId: string
      memberHandle: string
      videoId: string
      videoTitle: string
      commentId: string
      refetchAction: undefined
    }
  | {
      type: 'CreatorReceivesAuctionBid'
      amount: BN
      bidderId: string
      bidderHandle: string
      videoId: string
      videoTitle: string
      refetchAction: undefined
    }
  | { type: 'DirectChannelPaymentByMember'; amount: BN; payerId: string; payerHandle: string; refetchAction: undefined }
  // | { type: 'EnglishAuctionSettled'; price: BN; videoId: string; videoTitle: string }
  | { type: 'NewChannelFollower'; followerId: string; followerHandle: string; refetchAction: undefined }
  | { type: 'NftFeaturedOnMarketPlace'; videoId: string; videoTitle: string; refetchAction: undefined }
  | {
      type: 'NftPurchased'
      buyerId: string
      buyerHandle: string
      price: BN
      videoTitle: string
      videoId: string
      refetchAction: undefined
    }
  | { type: 'NftRoyaltyPaid'; amount: BN; videoId: string; videoTitle: string; refetchAction: undefined }
  | {
      type: 'VideoLiked' | 'VideoDisliked'
      memberId: string
      memberHandle: string
      videoId: string
      videoTitle: string
      refetchAction: undefined
    }
  | { type: 'VideoExcluded'; videoTitle: string; refetchAction: undefined }
  | {
      type: 'CreatorTokenRevenueSharePlanned'
      plannedAt: Date
      channelId: string
      tokenSymbol: string
      channelTitle: string
      refetchAction: undefined
    }
  | {
      type:
        | 'CreatorTokenIssued'
        | 'CreatorTokenSaleStarted'
        | 'CreatorTokenMarketStarted'
        | 'CreatorTokenRevenueShareEnded'
        | 'CreatorTokenRevenueShareStarted'
      channelId: string
      tokenSymbol: string
      channelTitle: string
      refetchAction: undefined
    }
  | {
      type: 'CreatorTokenMarketMint'
      mintedTokenAmount: string
      tokenSymbol: string
      minterHandle: string
      minterId: string
      paiedJoyAmount: string
      refetchAction: undefined
    }
  | {
      type: 'CreatorTokenMarketBurn'
      burnedTokenAmount: string
      tokenSymbol: string
      burnerHandle: string
      burnerId: string
      receivedJoyAmount: string
      refetchAction: undefined
    }
  | {
      type: 'CreatorTokenSaleMint'
      mintedTokenAmount: string
      tokenSymbol: string
      minterHandle: string
      minterId: string
      paiedJoyAmount: string
      refetchAction: undefined
    }

type AuctionType = 'AuctionTypeEnglish' | 'AuctionTypeOpen'
