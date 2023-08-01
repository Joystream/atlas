import { useEffect, useState } from 'react'

export const useMemberSettingsData = () => {
  const [data, setData] = useState<Record<string, boolean> | undefined>()

  useEffect(() => {
    // TODO: Fetch data from Orion
    new Promise((r) => setTimeout(r, 1000)).then(() =>
      setData({
        channelCreatedInAppNotificationEnabled: true,
        channelCreatedMailNotificationEnabled: true,
        commentRepyInAppNotificationEnabled: true,
        commentRepyMailNotificationEnabled: true,
        commentReactionInAppNotificationEnabled: true,
        commentReactionMailNotificationEnabled: true,
        newVideoInAppNotificationEnabled: true,
        newVideoMailNotificationEnabled: true,
        newNftAuctionInAppNotificationEnabled: true,
        newNftAuctionMailNotificationEnabled: true,
        newNftSaleInAppNotificationEnabled: true,
        newNftSaleMailNotificationEnabled: true,
        auctionOutBidInAppNotificationEnabled: true,
        auctionOutBidMailNotificationEnabled: true,
        auctionExpiredInAppNotificationEnabled: true,
        auctionExpiredMailNotificationEnabled: true,
        auctionWonInAppNotificationEnabled: true,
        auctionWonMailNotificationEnabled: true,
        auctionLostInAppNotificationEnabled: true,
        auctionLostMailNotificationEnabled: true,
        auctionBidWithdrawalInAppNotificationEnabled: true,
        auctionBidWithdrawalMailNotificationEnabled: true,
        fundFromCouncilInAppNotificationEnabled: true,
        fundFromCouncilMailNotificationEnabled: true,
        fundSentInAppNotificationEnabled: true,
        fundSentMailNotificationEnabled: true,
        fundFromWgInAppNotificationEnabled: true,
        fundFromWgMailNotificationEnabled: true,
      })
    )
  }, [])

  return { isLoading: !data, data }
}
