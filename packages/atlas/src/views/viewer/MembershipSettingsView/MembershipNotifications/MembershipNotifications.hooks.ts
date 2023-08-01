import { useEffect, useState } from 'react'

import { NotificationsState } from '@/components/NotificationsTable'

export const useMemberSettingsData = () => {
  const [data, setData] = useState<NotificationsState | undefined>()

  useEffect(() => {
    // TODO: Fetch data from Orion
    new Promise((r) => setTimeout(r, 1000)).then(() =>
      setData({
        channelCreatedNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        replyToCommentNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        reactionToCommentNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        videoPostedNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        newNftOnAuctionNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        newNftOnSaleNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        higherBidThanYoursMadeNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        auctionExpiredNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        auctionWonNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        auctionLostNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        openAuctionBidCanBeWithdrawnNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        fundsFromCouncilReceivedNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        fundsToExternalWalletSentNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        fundsFromWgReceivedNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
      })
    )
  }, [])

  return { isLoading: !data, data }
}
