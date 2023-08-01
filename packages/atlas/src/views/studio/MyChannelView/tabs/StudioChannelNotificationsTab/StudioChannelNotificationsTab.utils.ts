export const TABLE_STRUCTURE = [
  {
    title: 'Content moderation and featuring',
    rows: [
      {
        label: 'Your channel is excluded from the app',
        name: 'channelExcludedFromAppNotificationEnabled',
      },
      {
        label: 'Your video is excluded from the app',
        name: 'videoExcludedFromAppNotificationEnabled',
      },
      {
        label: 'Your video is featured on category page',
        name: 'videoFeaturedOnCategoryPageNotificationEnabled',
      },
      {
        label: 'Your NFT is featured on marketplace',
        name: 'nftFeaturedOnMarketPlace',
      },
      {
        label: 'Your video is featured as category hero video',
        name: 'videoFeaturedAsHeroNotificationEnabled',
      },
    ],
  },
  {
    title: 'Engagement',
    rows: [
      {
        label: 'Someone followed your channel',
        name: 'newChannelFollowerNotificationPreferences',
      },
      {
        label: 'Someone posted a comment on your video',
        name: 'videoCommentCreatedNotificationEnabled',
      },
      {
        label: 'Someone liked your video',
        name: 'videoLikedNotificationEnabled',
      },
      {
        label: 'Someone disliked your video',
        name: 'videoDislikedNotificationEnabled',
      },
    ],
  },
  {
    title: 'Youtube partnership program',
    rows: [
      {
        label: 'Your channel was successfully signed up to participate in the program',
        name: 'yppSignupSuccessfulNotificationEnabled',
      },
      {
        label: 'Your channel was verified',
        name: 'yppChannelVerifiedNotificationEnabled',
      },
      // {
      //   label: 'Your channel was suspended in the program participation',
      //   name: '',
      // },
    ],
  },
  {
    title: 'NFTS',
    rows: [
      {
        label: 'Someone purchased your NFT',
        name: 'nftBoughtNotificationEnabled',
      },
      {
        label: 'Someone placed a bid on your NFT',
        name: 'bidMadeOnNftNotificationEnabled',
      },
      // {
      //   label: 'Your timed auction expired',
      //   names: {
      //     inApp: 'auctionWonInAppNotificationEnabled',
      //     email: 'auctionWonMailNotificationEnabled',
      //   },
      // },
      {
        label: 'You received NFT royalties',
        name: 'royaltyReceivedNotificationEnabled',
      },
    ],
  },
  {
    title: 'Payouts',
    rows: [
      {
        label: 'You received direct payment',
        name: 'channelPaymentReceivedNotificationEnabled',
      },
      {
        label: 'You received funds from working group',
        name: 'channelReceivedFundsFromWgNotificationEnabled',
      },
      {
        label: 'New council payout is ready to be claimed',
        name: 'newPayoutUpdatedByCouncilNotificationEnabled',
      },
      {
        label: 'You transferred funds from channel wallet to member wallet',
        name: 'channelFundsWithdrawnNotificationEnabled',
      },
    ],
  },
]
