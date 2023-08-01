export const TABLE_STRUCTURE = [
  {
    title: 'Content moderation and featuring',
    rows: [
      {
        label: 'Your channel is excluded from the app',
        names: {
          inApp: 'channelCreatedInAppNotificationEnabled',
          email: 'channelCreatedMailNotificationEnabled',
        },
      },
      {
        label: 'Your video is excluded from the app',
        names: {
          inApp: 'channelCreatedInAppNotificationEnabled',
          email: 'channelCreatedMailNotificationEnabled',
        },
      },
      {
        label: 'Your video is featured on category page',
        names: {
          inApp: 'channelCreatedInAppNotificationEnabled',
          email: 'channelCreatedMailNotificationEnabled',
        },
      },
      {
        label: 'Your NFT is featured on marketplace',
        names: {
          inApp: 'channelCreatedInAppNotificationEnabled',
          email: 'channelCreatedMailNotificationEnabled',
        },
      },
      {
        label: 'Your video is featured as category hero video',
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
        label: 'Someone followed your channel',
        names: {
          inApp: 'commentRepyInAppNotificationEnabled',
          email: 'commentRepyMailNotificationEnabled',
        },
      },
      {
        label: 'Someone posted a comment on your video',
        names: {
          inApp: 'Someone liked your video',
          email: 'commentReactionMailNotificationEnabled',
        },
      },
      {
        label: 'Someone liked your video',
        names: {
          inApp: 'commentReactionInAppNotificationEnabled',
          email: 'commentReactionMailNotificationEnabled',
        },
      },
      {
        label: 'Someone disliked your video',
        names: {
          inApp: 'commentReactionInAppNotificationEnabled',
          email: 'commentReactionMailNotificationEnabled',
        },
      },
    ],
  },
  {
    title: 'Youtube partnership program',
    rows: [
      {
        label: 'Your channel was successfully signed up to participate in the program',
        names: {
          inApp: 'newVideoInAppNotificationEnabled',
          email: 'newVideoMailNotificationEnabled',
        },
      },
      {
        label: 'Your channel was verified',
        names: {
          inApp: 'newNftAuctionInAppNotificationEnabled',
          email: 'newNftAuctionMailNotificationEnabled',
        },
      },
      {
        label: 'Your channel was suspended in the program participation',
        names: {
          inApp: 'newNftSaleInAppNotificationEnabled',
          email: 'newNftSaleMailNotificationEnabled',
        },
      },
    ],
  },
  {
    title: 'NFTS',
    rows: [
      {
        label: 'Someone purchased your NFT',
        names: {
          inApp: 'auctionOutBidInAppNotificationEnabled',
          email: 'auctionOutBidMailNotificationEnabled',
        },
      },
      {
        label: 'Someone placed a bid on your NFT',
        names: {
          inApp: 'auctionExpiredInAppNotificationEnabled',
          email: 'auctionExpiredMailNotificationEnabled',
        },
      },
      {
        label: 'Your timed auction expired',
        names: {
          inApp: 'auctionWonInAppNotificationEnabled',
          email: 'auctionWonMailNotificationEnabled',
        },
      },
      {
        label: 'You received NFT royalties',
        names: {
          inApp: 'auctionLostInAppNotificationEnabled',
          email: 'auctionLostMailNotificationEnabled',
        },
      },
    ],
  },
  {
    title: 'Payouts',
    rows: [
      {
        label: 'You received direct payment',
        names: {
          inApp: 'fundFromCouncilInAppNotificationEnabled',
          email: 'fundFromCouncilMailNotificationEnabled',
        },
      },
      {
        label: 'You received funds from working group',
        names: {
          inApp: 'fundFromCouncilInAppNotificationEnabled',
          email: 'fundFromCouncilMailNotificationEnabled',
        },
      },
      {
        label: 'New council payout is ready to be claimed',
        names: {
          inApp: 'fundSentInAppNotificationEnabled',
          email: 'fundSentMailNotificationEnabled',
        },
      },
      {
        label: 'You transferred funds from channel wallet to member wallet',
        names: {
          inApp: 'fundFromWgInAppNotificationEnabled',
          email: 'fundFromWgMailNotificationEnabled',
        },
      },
    ],
  },
]
