import styled from '@emotion/styled'
import BN from 'bn.js'
import { useMemo } from 'react'

import { FullAmmCurveFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgActionArrowBottom, SvgActionArrowTop } from '@/assets/icons'
import { SvgEmptyStateIllustration } from '@/assets/illustrations'
import { NumberFormat } from '@/components/NumberFormat'
import { Pill } from '@/components/Pill'
import { Table, TableProps } from '@/components/Table'
import { DateBlockCell, LoadingMemberRow, TokenAmount } from '@/components/Table/Table.cells'
import { ColumnBox, RowBox } from '@/components/Table/Table.styles'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'

export const tableLoadingData = Array.from({ length: 5 }, () => ({
  date: (
    <RowBox>
      <SkeletonLoader height={20} width="70%" />
      <SkeletonLoader height={20} width="50%" />
    </RowBox>
  ),
  member: (
    <ColumnBox>
      <SkeletonLoader rounded height={32} width={32} />
      <SkeletonLoader height={20} width="40%" />
    </ColumnBox>
  ),
  action: <SkeletonLoader height={20} width="40%" />,
  pricePerUnit: <SkeletonLoader height={20} width="40%" />,
  quantity: <SkeletonLoader height={20} width="40%" />,
  amount: <SkeletonLoader height={20} width="40%" />,
}))

const COLUMNS: TableProps['columns'] = [
  { Header: 'Date', accessor: 'date' },
  { Header: 'Member', accessor: 'member' },
  { Header: 'Action', accessor: 'action' },
  { Header: 'Price per unit', accessor: 'pricePerUnit' },
  { Header: 'Quantity', accessor: 'quantity' },
  { Header: 'Amount', accessor: 'amount' },
]

const tableEmptyState = {
  title: 'No transactions made yet',
  description: 'When any member make a transaction on your market you will see the record here',
  icon: <SvgEmptyStateIllustration />,
}

type AmmTransactionsTableProps = {
  data: FullAmmCurveFragment['transactions']
  loading: boolean
  symbol: string
}

export const AmmTransactionsTable = ({ data, loading, symbol }: AmmTransactionsTableProps) => {
  const mappedData = useMemo(
    () =>
      data.map((row) => ({
        date: <DateBlockCell type="block" block={row.createdIn} />,
        member: <LoadingMemberRow memberId={row.account.member.id} />,
        action: (
          <Pill
            label={row.transactionType === 'BUY' ? 'Bought' : 'Sold'}
            icon={row.transactionType === 'BUY' ? <SvgActionArrowTop /> : <SvgActionArrowBottom />}
          />
        ),
        pricePerUnit: <TokenAmount tokenAmount={new BN(row.pricePerUnit)} />,
        quantity: (
          <NumberFormat value={+row.quantity} as="p" withToken customTicker={`$${symbol}`} variant="t100-strong" />
        ),
        amount: <TokenAmount tokenAmount={new BN(row.pricePaid)} />,
      })),
    [data, symbol]
  )

  return (
    <StyledTable
      minWidth={900}
      title="Market transactions"
      data={loading ? tableLoadingData : mappedData ?? []}
      columns={COLUMNS}
      emptyState={tableEmptyState}
    />
  )
}

const StyledTable = styled(Table)`
  th:not(:nth-of-type(1)):not(:nth-of-type(2)) {
    justify-content: end;
  }

  td:not(:nth-of-type(1)):not(:nth-of-type(2)) {
    align-items: end;

    > div {
      align-items: end;
    }
  }
`
