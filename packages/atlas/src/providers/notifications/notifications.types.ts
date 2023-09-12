import BN from 'bn.js'

export type NotificationRecord = { id: string; date: Date; block: number; read: boolean } & NotificationData
export type NotificationData =
  | { type: 'ChannelCreated'; channelId: string; channelTitle: string }
  | { type: 'CommentReply'; memberHandle: string; videoId: string; videoTitle: string }
  | { type: 'EnglishAuctionLost'; videoId: string; videoTitle: string }
  | { type: 'EnglishAuctionWon'; videoId: string; videoTitle: string }
  | { type: 'HigherBidPlaced'; newBidderHandle: string; videoId: string; videoTitle: string }
  | { type: 'NewAuction'; channelTitle: string; videoId: string; videoTitle: string }
  | { type: 'NewNftOnSale'; channelTitle: string; videoId: string; videoTitle: string }
  | { type: 'OpenAuctionLost'; videoTitle: string; videoId: string }
  | { type: 'OpenAuctionWon'; videoId: string; videoTitle: string }
  | { type: 'ReactionToComment'; memberHandle: string; videoId: string; videoTitle: string }
  | { type: 'VideoPosted'; channelTitle: string; videoId: string; videoTitle: string }
  | { type: 'ChannelExcluded' }
  | { type: 'ChannelFundsWithdrawn'; amount: BN }
  | { type: 'ChannelSuspended' }
  | { type: 'ChannelVerified' }
  | { type: 'CommentPostedToVideo'; memberHandle: string; videoId: string; videoTitle: string }
  | {
      type: 'CreatorReceivesAuctionBid'
      amount: BN
      bidderHandle: string
      videoId: string
      videoTitle: string
    }
  | { type: 'DirectChannelPaymentByMember'; amount: BN; payerHandle: string }
  | { type: 'EnglishAuctionSettled'; price: BN; videoId: string; videoTitle: string }
  | { type: 'NewChannelFollower'; followerHandle: string }
  | { type: 'NftFeaturedOnMarketPlace'; videoId: string; videoTitle: string }
  | { type: 'NftPurchased'; buyerHandle: string; price: BN; videoTitle: string; videoId: string }
  | { type: 'NftRoyaltyPaid'; amount: BN; videoId: string; videoTitle: string }
  | { type: 'VideoDisliked'; videoId: string; videoTitle: string }
  | { type: 'VideoExcluded'; videoTitle: string }
  | {
      type: 'VideoFeaturedAsCategoryHero'
      categoryId: string
      categoryName: string
      videoTitle: string
    }
  | {
      type: 'VideoFeaturedOnCategoryPage'
      categoryId: string
      categoryName: string
      videoTitle: string
    }
  | { type: 'VideoLiked'; videoId: string; videoTitle: string }
