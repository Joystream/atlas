import { FC, Fragment, useEffect } from 'react'
import { Controller, UseFormReturn, useForm } from 'react-hook-form'
import useResizeObserver from 'use-resize-observer'

import { Checkbox } from '@/components/_inputs/Checkbox'
import { EntitySettingTemplate } from '@/components/_templates/EntitySettingTemplate'

import { StyledActionBar, Table, Wrapper } from './MembershipNotifications.styles'

const TABLE_STRUCTURE = [
  { name: 'All', label: '', rows: [{ name: 'ALL', label: 'Subscribe to all notifications' }] },
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

const dataFromBackend = {
  inApp: {
    ALL: true,
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
    ALL: true,
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
}

export const MembershipNotifications = () => {
  const form = useForm<Record<'inApp' | 'email', Record<string, boolean>>>()

  const { ref: actionBarRef, height: actionBarBoundsHeight = 0 } = useResizeObserver({ box: 'border-box' })

  useEffect(() => {
    // Values will be set asynchronously
    Object.entries(dataFromBackend).forEach(([notifType, values]) =>
      Object.entries(values).forEach(([key, value]) => {
        form.setValue(`${notifType as 'inApp' | 'email'}.${key}`, value)
      })
    )
  }, [form])

  const handleEditMember = form.handleSubmit(async (data) => {
    // TODO
    console.log(data)
  })

  const isSubmitting = false
  return (
    <EntitySettingTemplate
      isFirst
      title="Membership address"
      description="When your public membership was created, it was linked to a new substrate account address built on polkadot protocol. This account holds all assets like tokens and NFTs that your membership accumulates. Set up all notifications regarding channels that you follow or your assets."
    >
      <form onSubmit={handleEditMember}>
        <Wrapper actionBarHeight={actionBarBoundsHeight}>
          <NotificationTableComponent sections={TABLE_STRUCTURE} form={form} />
        </Wrapper>

        <StyledActionBar
          ref={actionBarRef}
          primaryButton={{
            disabled: isSubmitting,
            text: isSubmitting ? 'Please wait...' : 'Publish changes',
            type: 'submit',
          }}
        />
      </form>
    </EntitySettingTemplate>
  )
}

type NotificationTableComponentProps = {
  sections: { name: string; label?: string; rows: { name: string; label: string }[] }[]
  form: UseFormReturn<Record<'inApp' | 'email', Record<string, boolean>>>
}
const NotificationTableComponent: FC<NotificationTableComponentProps> = ({ sections, form }) => (
  <Table>
    <thead>
      <tr>
        <th />
        <th>In App</th>
        <th>Email</th>
      </tr>
    </thead>

    <tbody>
      {sections.map(({ name, label = name, rows }) => (
        <Fragment key={name}>
          {label && (
            <tr>
              <th colSpan={3}>{label}</th>
            </tr>
          )}

          {rows.map(({ name, label }) => (
            <tr key={name}>
              <td>{label}</td>
              <td>
                <Controller
                  name={`inApp.${name}`}
                  control={form.control}
                  render={({ field: { value = false, onChange } }) => <Checkbox value={value} onChange={onChange} />}
                />
              </td>
              <td>
                <Controller
                  name={`email.${name}`}
                  control={form.control}
                  render={({ field: { value = false, onChange } }) => <Checkbox value={value} onChange={onChange} />}
                />
              </td>
            </tr>
          ))}
        </Fragment>
      ))}
    </tbody>
  </Table>
)
