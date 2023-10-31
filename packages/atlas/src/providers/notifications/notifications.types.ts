import BN from 'bn.js'

export type NotificationRecord = { id: string; date: Date; read: boolean } & NotificationData
export type NotificationData =
  // Members
  | { type: 'ChannelCreated'; channelId: string; channelTitle: string }
  | { type: 'CommentReply'; memberHandle: string; videoId: string; videoTitle: string; commentId: string }
  | { type: 'ReactionToComment'; memberHandle: string; videoId: string; videoTitle: string; commentId: string }
  | { type: 'VideoPosted'; channelId: string; channelTitle: string; videoId: string; videoTitle: string }
  | { type: 'NewNftOnSale'; channelId: string; channelTitle: string; videoId: string; videoTitle: string }
  | { type: 'NewAuction'; channelId: string; channelTitle: string; videoId: string; videoTitle: string }
  | { type: 'HigherBidPlaced'; newBidderHandle: string; videoId: string; videoTitle: string }
  | { type: 'AuctionWon'; auction: AuctionType; videoId: string; videoTitle: string }
  | { type: 'AuctionLost'; auction: AuctionType; videoId: string; videoTitle: string }

  // Channels
  | { type: 'ChannelExcluded' }
  | { type: 'ChannelFundsWithdrawn'; amount: BN }
  | { type: 'ChannelSuspended' }
  | { type: 'ChannelVerified' }
  | { type: 'CommentPostedToVideo'; memberHandle: string; videoId: string; videoTitle: string; commentId: string }
  | {
      type: 'CreatorReceivesAuctionBid'
      amount: BN
      bidderHandle: string
      videoId: string
      videoTitle: string
    }
  | { type: 'DirectChannelPaymentByMember'; amount: BN; payerId: string; payerHandle: string }
  // | { type: 'EnglishAuctionSettled'; price: BN; videoId: string; videoTitle: string }
  | { type: 'NewChannelFollower'; followerId: string; followerHandle: string }
  | { type: 'NftFeaturedOnMarketPlace'; videoId: string; videoTitle: string }
  | { type: 'NftPurchased'; buyerHandle: string; price: BN; videoTitle: string; videoId: string }
  | { type: 'NftRoyaltyPaid'; amount: BN; videoId: string; videoTitle: string }
  | { type: 'VideoLiked'; memberHandle: string; videoId: string; videoTitle: string }
  | { type: 'VideoDisliked'; memberHandle: string; videoId: string; videoTitle: string }
  | { type: 'VideoExcluded'; videoTitle: string }

type AuctionType = 'AuctionTypeEnglish' | 'AuctionTypeOpen'
