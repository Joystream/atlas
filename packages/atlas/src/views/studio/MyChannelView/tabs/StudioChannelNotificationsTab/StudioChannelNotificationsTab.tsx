import { RefObject, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { ActionBar } from '@/components/ActionBar'
import { NotificationsTable } from '@/components/NotificationsTable'
import { Portal } from '@/components/Portal'
import { EntitySettingTemplate } from '@/components/_templates/EntitySettingTemplate'

import { StyledForm } from './StudioChannelNotificationsTab.styles'

const TABLE_STRUCTURE = [
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

const useMemberSettingsData = () => {
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

export const StudioChannelNotificationsTab = ({ actionBarPortal }: { actionBarPortal: RefObject<HTMLDivElement> }) => {
  const { data, isLoading } = useMemberSettingsData()

  const form = useForm<Record<string, boolean>>()
  const {
    reset,
    formState: { isDirty },
  } = form

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => reset(data), [reset, data])

  const handleEditNotifications = form.handleSubmit(async (data) => {
    setIsSubmitting(true)
    // TODO: Send data to Orion
    await new Promise((r) => setTimeout(r, 2000))
    reset(data) // Reset with new data
    setIsSubmitting(false)
  })

  return (
    <>
      <StyledForm>
        <EntitySettingTemplate
          title="Channel notifications"
          description="Set up all notifications regarding this channel."
        >
          <NotificationsTable sections={TABLE_STRUCTURE} form={form} disabled={isLoading} />
        </EntitySettingTemplate>
      </StyledForm>
      <Portal containerRef={actionBarPortal}>
        <ActionBar
          primaryButton={{
            text: isSubmitting ? 'Please wait...' : 'Publish changes',
            disabled: isSubmitting || !isDirty,
            onClick: handleEditNotifications,
          }}
          secondaryButton={{
            text: 'Cancel',
            disabled: isSubmitting || !isDirty,
            onClick: () => reset(),
          }}
          isNoneCrypto
        />
      </Portal>
    </>
  )
}
