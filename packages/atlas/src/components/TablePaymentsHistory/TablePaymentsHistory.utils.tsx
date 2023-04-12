import { ReactElement } from 'react'

import { SvgActionCouncil, SvgActionCrown, SvgActionNft, SvgActionPayment, SvgActionRevenueShare } from '@/assets/icons'
import { SvgEmptyStateIllustration } from '@/assets/illustrations'
import { TableProps } from '@/components/Table'
import { ColumnBox, RowBox } from '@/components/TablePaymentsHistory/TablePaymentsHistory.styles'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'

export const tableLoadingData = Array.from({ length: 5 }, () => ({
  date: (
    <RowBox>
      <SkeletonLoader height={20} width="70%" />
      <SkeletonLoader height={20} width="50%" />
    </RowBox>
  ),
  type: (
    <ColumnBox>
      <SkeletonLoader rounded height={32} width={32} />
      <SkeletonLoader height={20} width="40%" />
    </ColumnBox>
  ),
  sender: (
    <RowBox align="end">
      <SkeletonLoader height={20} width="60%" />
      <SkeletonLoader height={20} width="40%" />
    </RowBox>
  ),
  amount: <SkeletonLoader height={20} width="40%" />,
  description: (
    <RowBox>
      <SkeletonLoader height={20} width="100%" />
      <SkeletonLoader height={20} width="20%" />
    </RowBox>
  ),
}))

export const tableEmptyState = {
  title: 'No payments here yet',
  description:
    'Here you will see proceedings to your channel balance from sold NFTs and royalties, claimed council rewards, direct payments from members to your channel and withdrawals from channel balance.',
  icon: <SvgEmptyStateIllustration />,
}

export type PaymentType =
  | 'nft-sale'
  | 'nft-royalty'
  | 'claimed-reward'
  | 'withdrawal'
  | 'ypp-reward'
  | 'council-reward'
  | 'direct-payment'
  | 'revenue-share'

export const paymentTypeMappings: Record<
  PaymentType,
  {
    title: string
    icon?: ReactElement
  }
> = {
  'nft-sale': {
    title: 'NFT sale',
    icon: <SvgActionNft />,
  },
  'nft-royalty': {
    title: 'NFT royalty',
    icon: <SvgActionCrown />,
  },
  'claimed-reward': {
    title: 'Council reward',
    icon: <SvgActionCouncil />,
  },
  'withdrawal': {
    title: 'Withdrawal',
    icon: <SvgActionRevenueShare />,
  },
  'ypp-reward': {
    title: 'YPP reward',
    icon: <SvgActionRevenueShare />,
  },
  'council-reward': {
    title: 'Council reward',
    icon: <SvgActionCouncil />,
  },
  'direct-payment': {
    title: 'Direct payment',
    icon: <SvgActionPayment />,
  },
  'revenue-share': {
    title: 'Revenue share',
    icon: <SvgActionRevenueShare />,
  },
}

export const COLUMNS: TableProps['columns'] = [
  {
    Header: 'Date',
    accessor: 'date',
    width: 100,
  },
  {
    Header: 'Type',
    accessor: 'type',
    width: 100,
  },
  {
    Header: 'Sender',
    accessor: 'sender',
    width: 100,
  },
  {
    Header: 'Amount',
    accessor: 'amount',
    width: 100,
  },
  {
    Header: 'Description',
    accessor: 'description',
    width: 200,
  },
]
