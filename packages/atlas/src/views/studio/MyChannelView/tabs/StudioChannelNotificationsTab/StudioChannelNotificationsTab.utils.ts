export const TABLE_STRUCTURE = [
  {
    title: 'Content moderation and featuring',
    rows: [
      {
        label: 'Your channel is excluded from the app',
        name: 'channelExcludedFromApp',
      },
      {
        label: 'Your video is featured on category page',
        name: 'videoFeaturedOnCategoryPage',
      },
      {
        label: 'Your NFT is featured on marketplace',
        name: 'nftFeaturedOnMarketPlace',
      },
      {
        label: 'Your video is featured as category hero video',
        name: 'videoFeaturedAsHero',
      },
      {
        label: 'Your video is excluded from the app',
        name: 'videoExcludedFromApp',
      },
    ],
  },
  {
    title: 'Engagement',
    rows: [
      {
        label: 'Someone followed your channel',
        name: 'newChannelFollower',
      },
      {
        label: 'Someone posted a comment on your video',
        name: 'videoCommentCreated',
      },
      {
        label: 'Someone liked your video',
        name: 'videoLiked',
      },
      {
        label: 'Someone disliked your video',
        name: 'videoDisliked',
      },
    ],
  },
  {
    title: 'Youtube partnership program',
    rows: [
      // {
      //   label: 'Your channel was successfully signed up to participate in the program',
      //   name: 'yppSignupSuccessful',
      // },
      {
        label: 'Your channel was verified',
        name: 'yppChannelVerified',
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
        name: 'nftBought',
      },
      {
        label: 'Someone placed a bid on your NFT',
        name: 'bidMadeOnNft',
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
        name: 'royaltyReceived',
      },
    ],
  },
  {
    title: 'Payouts',
    rows: [
      {
        label: 'You received direct payment',
        name: 'channelPaymentReceived',
      },
      {
        label: 'You received funds from working group',
        name: 'channelReceivedFundsFromWg',
      },
      {
        label: 'New council payout is ready to be claimed',
        name: 'newPayoutUpdatedByCouncil',
      },
      {
        label: 'You transferred funds from channel wallet to member wallet',
        name: 'channelFundsWithdrawn',
      },
    ],
  },
]
