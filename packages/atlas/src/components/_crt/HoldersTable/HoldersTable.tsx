import styled from '@emotion/styled'
import { useMemo } from 'react'

import { BasicMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { NumberFormat } from '@/components/NumberFormat'
import { Pill } from '@/components/Pill'
import { Table, TableProps } from '@/components/Table'
import { MemberCell } from '@/components/Table/Table.cells'
import { ColumnBox } from '@/components/Table/Table.styles'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { useGetTokenBalance } from '@/hooks/useGetTokenBalance'

export const tableLoadingData = Array.from({ length: 5 }, () => ({
  member: (
    <ColumnBox>
      <SkeletonLoader rounded height={32} width={32} />
      <SkeletonLoader height={20} width="40%" />
    </ColumnBox>
  ),
  transferable: <SkeletonLoader height={20} width="40%" />,
  vested: <SkeletonLoader height={20} width="40%" />,
  total: <SkeletonLoader height={20} width="40%" />,
  allocation: <SkeletonLoader height={20} width="40%" />,
}))

const COLUMNS: TableProps['columns'] = [
  { Header: 'Member', accessor: 'member' },
  { Header: 'Transferable', accessor: 'transferable' },
  { Header: 'Vested', accessor: 'vested' },
  { Header: 'Total', accessor: 'total' },
  { Header: 'Allocation', accessor: 'allocation' },
]

export type HoldersTableProps = {
  data: {
    member: BasicMembershipFieldsFragment
    tokenId: string
    vested: number
    total: number
    allocation: number
  }[]
  isLoading: boolean
  currentMemberId: string
  symbol?: string
} & Pick<TableProps, 'pagination' | 'pageSize'>

export const HoldersTable = ({ data, currentMemberId, symbol, pagination, pageSize, isLoading }: HoldersTableProps) => {
  const mappedData = useMemo(
    () =>
      data.map((row) => ({
        member: (
          <MemberCell
            member={row.member}
            additionalNode={row.member.id === currentMemberId ? <Pill label="You" /> : null}
          />
        ),
        transferable: <TransferableBalance memberId={row.member.id} tokenId={row.tokenId} ticker={symbol} />,
        vested: <NumberFormat value={row.vested} as="p" withToken customTicker={`$${symbol}`} />,
        total: <NumberFormat value={row.total} as="p" withToken customTicker={`$${symbol}`} />,
        allocation: <NumberFormat value={row.allocation} as="p" format="short" withToken customTicker="%" />,
      })),
    [currentMemberId, data, symbol]
  )
  return (
    <StyledTable
      minWidth={750}
      pageSize={pageSize}
      columns={COLUMNS}
      data={isLoading ? tableLoadingData : mappedData}
      pagination={pagination}
    />
  )
}

const TransferableBalance = ({ memberId, tokenId, ticker }: { memberId: string; tokenId: string; ticker?: string }) => {
  const { tokenBalance } = useGetTokenBalance(tokenId, memberId)
  return <NumberFormat value={tokenBalance} as="p" withToken customTicker={`$${ticker}`} />
}

const StyledTable = styled(Table)`
  th:not(:nth-child(1)) {
    justify-content: end;
  }

  td:not(:nth-child(1)) {
    align-items: end;

    > div {
      align-items: end;
    }
  }
`
