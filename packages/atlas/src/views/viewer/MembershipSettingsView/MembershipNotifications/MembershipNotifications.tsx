import { FC, Fragment } from 'react'

import { Checkbox } from '@/components/_inputs/Checkbox'
import { EntitySettingTemplate } from '@/components/_templates/EntitySettingTemplate'

import { Table } from './MembershipNotifications.styles'

const TABLE_STRUCTURE = [
  { name: 'All', label: '', rows: [{ key: 'ALL', label: 'Subscribe to all notifications' }] },
  {
    name: 'Generic',
    rows: [
      { key: 'COMMENT_REPY', label: 'Someone replied to your comment' },
      { key: 'COMMENT_REACTION', label: 'Someone reacted to your comment' },
    ],
  },
  {
    name: 'Engagement',
    rows: [
      { key: 'COMMENT_REPY', label: 'Someone replied to your comment' },
      { key: 'COMMENT_REACTION', label: 'Someone reacted to your comment' },
    ],
  },
  {
    name: 'Followed channels',
    rows: [
      { key: 'NEW_VIDEO', label: 'Posted a new video' },
      { key: 'NEW_NFT_AUCTION', label: 'Put a new NFT on auction' },
      { key: 'NEW_NFT_SALE', label: 'Put a new NFT on sale' },
    ],
  },
  {
    name: 'NFT',
    rows: [
      { key: 'AUCTION_OUT_BID', label: 'Someone placed higher bid than you' },
      { key: 'AUCTION_EXPIRED', label: 'Auction you participated in expired' },
      { key: 'AUCTION_WON', label: 'You won the auction' },
      { key: 'AUCTION_LOST', label: 'You lost the auction' },
      { key: 'AUCTION_BID_WITHDRAWAL', label: 'Your bid withdrawal is enabled' },
    ],
  },
  {
    name: 'Payout',
    rows: [
      { key: 'FUND_FROM_COUNCIL', label: 'You receive funds from council' },
      { key: 'FUND_SENT', label: 'You send funds to external wallet' },
      { key: 'FUND_FROM_WG', label: 'You receive funds from working group' },
    ],
  },
]

export const MembershipNotifications = () => {
  return (
    <EntitySettingTemplate
      isFirst
      title="Membership address"
      description="When your public membership was created, it was linked to a new substrate account address built on polkadot protocol. This account holds all assets like tokens and NFTs that your membership accumulates. Set up all notifications regarding channels that you follow or your assets."
    >
      <NotificationTableComponent sections={TABLE_STRUCTURE} data={{}} />
    </EntitySettingTemplate>
  )
}

type NotificationKey = string
type NotificationTableComponentProps = {
  sections: { name: string; label?: string; rows: { key: string; label: NotificationKey }[] }[]
  data: Record<NotificationKey, [boolean, boolean]>
}

const NotificationTableComponent: FC<NotificationTableComponentProps> = ({ sections, data }) => {
  return (
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

            {rows.map(({ key, label }) => (
              <tr key={key}>
                <td>{label}</td>
                <td>
                  <Checkbox value={data[key]?.[0] ?? false} />
                </td>
                <td>
                  <Checkbox value={data[key]?.[1] ?? false} />
                </td>
              </tr>
            ))}
          </Fragment>
        ))}
      </tbody>
    </Table>
  )
}
