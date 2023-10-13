import styled from '@emotion/styled'
import { useMemo } from 'react'

import { NumberFormat } from '@/components/NumberFormat'
import { Table, TableProps } from '@/components/Table'
import { DateBlockCell, LoadingMemberRow, TokenAmount } from '@/components/Table/Table.cells'

const COLUMNS: TableProps['columns'] = [
  { Header: 'Date', accessor: 'stakedAt' },
  { Header: 'Member', accessor: 'member' },
  { Header: 'Staked', accessor: 'staked' },
  { Header: 'Earnings', accessor: 'earnings' },
]

export type RevenueShareStakersTableProps = {
  data: {
    stakedAtBlock: number
    memberId: string
    staked: number
    earnings: number
  }[]
  tokenSymbol?: string | null
}

export const RevenueShareStakersTable = ({ data, tokenSymbol = 'N/A' }: RevenueShareStakersTableProps) => {
  const mappedData = useMemo(() => {
    return data.map((row) => {
      return {
        stakedAt: <DateBlockCell type="block" block={row.stakedAtBlock} />,
        member: <LoadingMemberRow memberId={row.memberId} />,
        staked: <NumberFormat value={row.staked} as="p" variant="t100" withToken customTicker={`$${tokenSymbol}`} />,
        earnings: <TokenAmount variant="t100-strong" tokenAmount={row.earnings} />,
      }
    })
  }, [data, tokenSymbol])

  return <StyledTable columns={COLUMNS} data={mappedData} />
}

const StyledTable = styled(Table)`
  th:nth-of-type(3),
  th:nth-of-type(4) {
    justify-content: end;
  }

  td:nth-of-type(3),
  td:nth-of-type(4) {
    align-items: end;

    > div {
      align-items: end;
    }
  }
`
