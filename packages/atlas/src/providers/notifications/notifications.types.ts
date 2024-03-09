import BN from 'bn.js'

export type NotificationRecord = { id: string; date: Date; read: boolean } & NotificationData
export type NotificationData =
  // Members
  | { type: 'ChannelCreated'; channelId: string; channelTitle: string }
  | {
      type: 'CommentReply'
      memberId: string
      memberHandle: string
      videoId: string
      videoTitle: string
      commentId: string
    }
  | {
      type: 'ReactionToComment'
      memberId: string
      memberHandle: string
      videoId: string
      videoTitle: string
      commentId: string
    }
  | { type: 'VideoPosted'; channelId: string; channelTitle: string; videoId: string; videoTitle: string }
  | { type: 'NewNftOnSale'; channelId: string; channelTitle: string; videoId: string; videoTitle: string }
  | { type: 'NewAuction'; channelId: string; channelTitle: string; videoId: string; videoTitle: string }
  | { type: 'HigherBidPlaced'; newBidderId: string; newBidderHandle: string; videoId: string; videoTitle: string }
  | { type: 'AuctionWon'; auction: AuctionType; videoId: string; videoTitle: string }
  | { type: 'AuctionLost'; auction: AuctionType; videoId: string; videoTitle: string }

  // Channels
  | { type: 'ChannelExcluded' }
  | { type: 'ChannelFundsWithdrawn'; amount: BN }
  | { type: 'ChannelSuspended' }
  | { type: 'ChannelVerified' }
  | {
      type: 'CommentPostedToVideo'
      memberId: string
      memberHandle: string
      videoId: string
      videoTitle: string
      commentId: string
    }
  | {
      type: 'CreatorReceivesAuctionBid'
      amount: BN
      bidderId: string
      bidderHandle: string
      videoId: string
      videoTitle: string
    }
  | { type: 'DirectChannelPaymentByMember'; amount: BN; payerId: string; payerHandle: string }
  // | { type: 'EnglishAuctionSettled'; price: BN; videoId: string; videoTitle: string }
  | { type: 'NewChannelFollower'; followerId: string; followerHandle: string }
  | { type: 'NftFeaturedOnMarketPlace'; videoId: string; videoTitle: string }
  | { type: 'NftPurchased'; buyerId: string; buyerHandle: string; price: BN; videoTitle: string; videoId: string }
  | { type: 'NftRoyaltyPaid'; amount: BN; videoId: string; videoTitle: string }
  | { type: 'VideoLiked'; memberId: string; memberHandle: string; videoId: string; videoTitle: string }
  | { type: 'VideoDisliked'; memberId: string; memberHandle: string; videoId: string; videoTitle: string }
  | { type: 'VideoExcluded'; videoTitle: string }
  | {
      type: 'CreatorTokenRevenueSharePlanned'
      plannedAt: Date
      channelId: string
      tokenSymbol: string
      channelTitle: string
    }
  | {
      type: 'CreatorTokenRevenueShareStarted'
      channelId: string
      tokenSymbol: string
      channelTitle: string
    }
  | {
      type: 'CreatorTokenRevenueShareEnded'
      channelId: string
      tokenSymbol: string
      channelTitle: string
    }
  | {
      type: 'CreatorTokenMarketStarted'
      channelId: string
      tokenSymbol: string
      channelTitle: string
    }
  | {
      type: 'CreatorTokenSaleStarted'
      channelId: string
      tokenSymbol: string
      channelTitle: string
    }
  | {
      type: 'CreatorTokenIssued'
      channelId: string
      tokenSymbol: string
      channelTitle: string
    }
  | {
      type: 'CreatorTokenMarketMint'
      mintedTokenAmount: string
      tokenSymbol: string
      minterHandle: string
      minterId: string
      paiedJoyAmount: string
    }
  | {
      type: 'CreatorTokenMarketBurn'
      burnedTokenAmount: string
      tokenSymbol: string
      burnerHandle: string
      burnerId: string
      receivedJoyAmount: string
    }
  | {
      type: 'CreatorTokenSaleMint'
      mintedTokenAmount: string
      tokenSymbol: string
      minterHandle: string
      minterId: string
      paiedJoyAmount: string
    }

type AuctionType = 'AuctionTypeEnglish' | 'AuctionTypeOpen'
