export const TABLE_STRUCTURE = [
  {
    title: 'Generic',
    rows: [
      {
        label: 'New channel created',
        name: 'channelCreatedNotificationEnabled',
      },
    ],
  },
  {
    title: 'Engagement',
    rows: [
      {
        label: 'Someone replied to your comment',
        name: 'replyToCommentNotificationEnabled',
      },
      {
        label: 'Someone reacted to your comment',
        name: 'reactionToCommentNotificationEnabled',
      },
    ],
  },
  {
    title: 'Followed channels',
    rows: [
      {
        label: 'Posted a new video',
        name: 'videoPostedNotificationEnabled',
      },
      {
        label: 'Put a new NFT on auction',
        name: 'newNftOnAuctionNotificationEnabled',
      },
      {
        label: 'Put a new NFT on sale',
        name: 'newNftOnSaleNotificationEnabled',
      },
    ],
  },
  {
    title: 'NFT',
    rows: [
      {
        label: 'Someone placed higher bid than you',
        name: 'higherBidThanYoursMadeNotificationEnabled',
      },
      {
        label: 'Auction you participated in expired',
        name: 'auctionExpiredNotificationEnabled',
      },
      {
        label: 'You won the auction',
        name: 'auctionWonNotificationEnabled',
      },
      {
        label: 'You lost the auction',
        name: 'auctionLostNotificationEnabled',
      },
      {
        label: 'Your bid withdrawal is enabled',
        name: 'openAuctionBidCanBeWithdrawnNotificationEnabled',
      },
    ],
  },
  {
    title: 'Payouts',
    rows: [
      {
        label: 'You receive funds from council',
        name: 'fundsFromCouncilReceivedNotificationEnabled',
      },
      {
        label: 'You send funds to external wallet',
        name: 'fundsToExternalWalletSentNotificationEnabled',
      },
      {
        label: 'You receive funds from working group',
        name: 'fundsFromWgReceivedNotificationEnabled',
      },
    ],
  },
]
