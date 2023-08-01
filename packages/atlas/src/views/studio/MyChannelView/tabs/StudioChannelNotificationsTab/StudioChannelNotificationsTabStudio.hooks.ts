import { useEffect, useState } from 'react'

import { NotificationsState } from '@/components/NotificationsTable'

export const useMemberSettingsData = () => {
  const [data, setData] = useState<NotificationsState | undefined>()

  useEffect(() => {
    // TODO: Fetch data from Orion
    new Promise((r) => setTimeout(r, 1000)).then(() =>
      setData({
        channelExcludedFromAppNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        videoExcludedFromAppNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        videoFeaturedAsHeroNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        videoFeaturedOnCategoryPageNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        nftFeaturedOnMarketPlace: { inAppEnabled: true, emailEnabled: true },
        newChannelFollowerNotificationPreferences: { inAppEnabled: true, emailEnabled: true },
        videoCommentCreatedNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        videoLikedNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        videoDislikedNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        yppSignupSuccessfulNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        yppChannelVerifiedNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        nftBoughtNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        bidMadeOnNftNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        royaltyReceivedNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        channelPaymentReceivedNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        channelReceivedFundsFromWgNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        newPayoutUpdatedByCouncilNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
        channelFundsWithdrawnNotificationEnabled: { inAppEnabled: true, emailEnabled: true },
      })
    )
  }, [])

  return { isLoading: !data, data }
}
