import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import useResizeObserver from 'use-resize-observer'

import { NotificationsState, NotificationsTable } from '@/components/NotificationsTable'
import { EntitySettingTemplate } from '@/components/_templates/EntitySettingTemplate'

import { StyledActionBar, Wrapper } from './MembershipNotifications.styles'

const TABLE_STRUCTURE = [
  {
    name: 'Generic',
    rows: [{ name: 'NEW_CHANNEL', label: 'New channel created' }],
  },
  {
    name: 'Engagement',
    rows: [
      { name: 'COMMENT_REPY', label: 'Someone replied to your comment' },
      { name: 'COMMENT_REACTION', label: 'Someone reacted to your comment' },
    ],
  },
  {
    name: 'Followed channels',
    rows: [
      { name: 'NEW_VIDEO', label: 'Posted a new video' },
      { name: 'NEW_NFT_AUCTION', label: 'Put a new NFT on auction' },
      { name: 'NEW_NFT_SALE', label: 'Put a new NFT on sale' },
    ],
  },
  {
    name: 'NFT',
    rows: [
      { name: 'AUCTION_OUT_BID', label: 'Someone placed higher bid than you' },
      { name: 'AUCTION_EXPIRED', label: 'Auction you participated in expired' },
      { name: 'AUCTION_WON', label: 'You won the auction' },
      { name: 'AUCTION_LOST', label: 'You lost the auction' },
      { name: 'AUCTION_BID_WITHDRAWAL', label: 'Your bid withdrawal is enabled' },
    ],
  },
  {
    name: 'Payout',
    rows: [
      { name: 'FUND_FROM_COUNCIL', label: 'You receive funds from council' },
      { name: 'FUND_SENT', label: 'You send funds to external wallet' },
      { name: 'FUND_FROM_WG', label: 'You receive funds from working group' },
    ],
  },
]

const useMemberSettingsData = () => {
  const [data, setData] = useState<NotificationsState | undefined>()

  useEffect(() => {
    // TODO: Fetch data from Orion
    new Promise((r) => setTimeout(r, 1000)).then(() =>
      setData({
        inApp: {
          NEW_CHANNEL: true,
          COMMENT_REPY: true,
          COMMENT_REACTION: true,
          NEW_VIDEO: true,
          NEW_NFT_AUCTION: true,
          NEW_NFT_SALE: true,
          AUCTION_OUT_BID: true,
          AUCTION_EXPIRED: true,
          AUCTION_WON: true,
          AUCTION_LOST: true,
          AUCTION_BID_WITHDRAWAL: true,
          FUND_FROM_COUNCIL: true,
          FUND_SENT: true,
          FUND_FROM_WG: true,
        },
        email: {
          NEW_CHANNEL: true,
          COMMENT_REPY: true,
          COMMENT_REACTION: true,
          NEW_VIDEO: true,
          NEW_NFT_AUCTION: true,
          NEW_NFT_SALE: true,
          AUCTION_OUT_BID: true,
          AUCTION_EXPIRED: true,
          AUCTION_WON: true,
          AUCTION_LOST: true,
          AUCTION_BID_WITHDRAWAL: true,
          FUND_FROM_COUNCIL: true,
          FUND_SENT: true,
          FUND_FROM_WG: true,
        },
      })
    )
  }, [])

  return { isLoading: !data, data }
}

export const MembershipNotifications = () => {
  const { data, isLoading } = useMemberSettingsData()

  const form = useForm<NotificationsState>()
  const {
    reset,
    formState: { isDirty },
  } = form

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => reset(data), [reset, data])

  const { ref: actionBarRef, height: actionBarBoundsHeight = 0 } = useResizeObserver({ box: 'border-box' })

  const handleEditMember = form.handleSubmit(async (data) => {
    setIsSubmitting(true)
    // TODO: Send data to Orion
    await new Promise((r) => setTimeout(r, 2000))
    reset(data) // Reset with new data
    setIsSubmitting(false)
  })

  return (
    <EntitySettingTemplate
      isFirst
      title="Membership address"
      description="When your public membership was created, it was linked to a new substrate account address built on polkadot protocol. This account holds all assets like tokens and NFTs that your membership accumulates. Set up all notifications regarding channels that you follow or your assets."
    >
      <form onSubmit={handleEditMember}>
        <Wrapper actionBarHeight={actionBarBoundsHeight}>
          <NotificationsTable sections={TABLE_STRUCTURE} form={form} disabled={isLoading} />
        </Wrapper>

        <StyledActionBar
          ref={actionBarRef}
          primaryButton={{
            text: isSubmitting ? 'Please wait...' : 'Publish changes',
            disabled: isSubmitting || !isDirty,
            type: 'submit',
          }}
          secondaryButton={{
            text: 'Cancel',
            disabled: isSubmitting || !isDirty,
            onClick: () => reset(),
          }}
        />
      </form>
    </EntitySettingTemplate>
  )
}
