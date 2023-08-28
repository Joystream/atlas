import BN from 'bn.js'
import { FC, useMemo } from 'react'

import { SvgActionArrowBottom, SvgActionArrowTop } from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { DateTimeBlock } from '@/components/DateTimeBlock'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat } from '@/components/NumberFormat'
import { TableProps } from '@/components/Table'
import { Loader } from '@/components/_loaders/Loader'

import { Badge, MemberRow, StyledTable } from './CrtTransactionsTable.styles'

const COLUMNS: TableProps['columns'] = [
  { Header: 'Date', accessor: 'date' },
  { Header: 'Member', accessor: 'member' },
  { Header: 'Action', accessor: 'action' },
  { Header: 'Price per unit', accessor: 'price' },
  { Header: 'Quantity', accessor: 'qty' },
  { Header: 'Amount', accessor: 'amount' },
]

type CrtTransaction = {
  date: Date
  member: {
    avatarUrls?: string[] | null
    avatarLoading?: boolean
    hasAvatarUploadFailed?: boolean
    handle?: string | null
    loading?: boolean
  }
  action: 'bought' | 'sold'
  price: number | BN
  qty: number
  amount: number | BN
}

export type CrtTransactionsTableProps = { ticker: string; transactions: CrtTransaction[] }
export const CrtTransactionsTable: FC<CrtTransactionsTableProps> = ({ ticker, transactions }) => {
  const data = useMemo(
    () =>
      transactions.map(({ date, member, action, price, qty, amount }) => ({
        date: <DateTimeBlock date={date} />,

        member: member.loading ? (
          <Loader variant="small" />
        ) : (
          <MemberRow>
            <Avatar
              size={24}
              assetUrls={member.avatarUrls}
              loading={member.avatarLoading}
              hasAvatarUploadFailed={member.hasAvatarUploadFailed}
            />
            {member.handle}
          </MemberRow>
        ),

        action:
          action === 'bought' ? (
            <Badge>
              <SvgActionArrowTop />
              Bought
            </Badge>
          ) : (
            <Badge>
              <SvgActionArrowBottom />
              Sold
            </Badge>
          ),

        price: (
          <NumberFormat
            as="span"
            format="full"
            icon={<JoyTokenIcon size={16} variant="silver" />}
            value={price}
            withDenomination
          />
        ),

        qty: <NumberFormat as="span" format="short" value={qty} customTicker={ticker} withToken />,

        amount: (
          <NumberFormat
            as="span"
            format="full"
            icon={<JoyTokenIcon size={16} variant="silver" />}
            value={amount}
            withDenomination
          />
        ),
      })),
    [transactions, ticker]
  )
  return <StyledTable title="Market transactions" columns={COLUMNS} data={data} />
}
