export const TABLE_STRUCTURE = [
  {
    title: 'Generic',
    rows: [
      {
        label: 'New channel created',
        names: {
          inApp: 'channelCreatedInAppNotificationEnabled',
          email: 'channelCreatedMailNotificationEnabled',
        },
      },
    ],
  },
  {
    title: 'Engagement',
    rows: [
      {
        label: 'Someone replied to your comment',
        names: {
          inApp: 'commentRepyInAppNotificationEnabled',
          email: 'commentRepyMailNotificationEnabled',
        },
      },
      {
        label: 'Someone reacted to your comment',
        names: {
          inApp: 'commentReactionInAppNotificationEnabled',
          email: 'commentReactionMailNotificationEnabled',
        },
      },
    ],
  },
  {
    title: 'Followed channels',
    rows: [
      {
        label: 'Posted a new video',
        names: {
          inApp: 'newVideoInAppNotificationEnabled',
          email: 'newVideoMailNotificationEnabled',
        },
      },
      {
        label: 'Put a new NFT on auction',
        names: {
          inApp: 'newNftAuctionInAppNotificationEnabled',
          email: 'newNftAuctionMailNotificationEnabled',
        },
      },
      {
        label: 'Put a new NFT on sale',
        names: {
          inApp: 'newNftSaleInAppNotificationEnabled',
          email: 'newNftSaleMailNotificationEnabled',
        },
      },
    ],
  },
  {
    title: 'NFT',
    rows: [
      {
        label: 'Someone placed higher bid than you',
        names: {
          inApp: 'auctionOutBidInAppNotificationEnabled',
          email: 'auctionOutBidMailNotificationEnabled',
        },
      },
      {
        label: 'Auction you participated in expired',
        names: {
          inApp: 'auctionExpiredInAppNotificationEnabled',
          email: 'auctionExpiredMailNotificationEnabled',
        },
      },
      {
        label: 'You won the auction',
        names: {
          inApp: 'auctionWonInAppNotificationEnabled',
          email: 'auctionWonMailNotificationEnabled',
        },
      },
      {
        label: 'You lost the auction',
        names: {
          inApp: 'auctionLostInAppNotificationEnabled',
          email: 'auctionLostMailNotificationEnabled',
        },
      },
      {
        label: 'Your bid withdrawal is enabled',
        names: {
          inApp: 'auctionBidWithdrawalInAppNotificationEnabled',
          email: 'auctionBidWithdrawalMailNotificationEnabled',
        },
      },
    ],
  },
  {
    title: 'Payouts',
    rows: [
      {
        label: 'You receive funds from council',
        names: {
          inApp: 'fundFromCouncilInAppNotificationEnabled',
          email: 'fundFromCouncilMailNotificationEnabled',
        },
      },
      {
        label: 'You send funds to external wallet',
        names: {
          inApp: 'fundSentInAppNotificationEnabled',
          email: 'fundSentMailNotificationEnabled',
        },
      },
      {
        label: 'You receive funds from working group',
        names: {
          inApp: 'fundFromWgInAppNotificationEnabled',
          email: 'fundFromWgMailNotificationEnabled',
        },
      },
    ],
  },
]
