import styled from '@emotion/styled'
import { useMemo } from 'react'

import { TokenStatus } from '@/api/queries/__generated__/baseTypes.generated'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat } from '@/components/NumberFormat'
import { Table, TableProps } from '@/components/Table'
import { ColumnBox } from '@/components/Table/Table.styles'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar } from '@/styles'
import { pluralizeNoun } from '@/utils/misc'
import { formatDate } from '@/utils/time'

import { CrtStatus, TokenInfo } from '../CrtPortfolioTable'

export const tableLoadingData = Array.from({ length: 5 }, () => ({
  token: (
    <ColumnBox>
      <SkeletonLoader rounded height={32} width={32} />
      <SkeletonLoader height={20} width="40%" />
    </ColumnBox>
  ),
  status: <SkeletonLoader height={20} width="40%" />,
  createdAt: <SkeletonLoader height={20} width="40%" />,
  marketCap: <SkeletonLoader height={20} width="40%" />,
  totalRevenue: <SkeletonLoader height={20} width="40%" />,
  holders: <SkeletonLoader height={20} width="40%" />,
}))

const COLUMNS: TableProps['columns'] = [
  { Header: 'Token', accessor: 'token', width: 300 },
  { Header: 'Status', accessor: 'status', width: 100 },
  { Header: 'Date created', accessor: 'createdAt', width: 100 },
  { Header: 'Market cap', accessor: 'marketCap', width: 100 },
  { Header: 'Total rev.', accessor: 'totalRevenue', width: 100 },
  { Header: 'Holders', accessor: 'holders', width: 100 },
]

export type MarketplaceToken = {
  tokenTitle: string
  tokenName: string
  isVerified: boolean
  status: TokenStatus
  createdAt: Date
  marketCap: number
  totalRevenue: number
  holdersNum: number
  channelId: string
}

export type MarketplaceCrtTableProps = {
  data: MarketplaceToken[]
  isLoading: boolean
  emptyState?: TableProps['emptyState']
}

export const MarketplaceCrtTable = ({ data, emptyState, isLoading }: MarketplaceCrtTableProps) => {
  const mappingData = useMemo(() => {
    return data.map((row) => ({
      token: <TokenInfo {...row} />,
      status: <CrtStatus status={row.status} />,
      createdAt: (
        <Text variant="t100" as="p">
          {formatDate(row.createdAt)}
        </Text>
      ),
      marketCap: (
        <NumberFormat
          icon={<JoyTokenIcon size={16} variant="gray" />}
          format="short"
          withDenomination
          value={row.marketCap}
          as="p"
        />
      ),
      totalRevenue: (
        <NumberFormat
          icon={<JoyTokenIcon size={16} variant="gray" />}
          format="short"
          withDenomination
          value={row.totalRevenue}
          as="p"
        />
      ),
      holders: (
        <Text variant="t100" as="p">
          {pluralizeNoun(row.holdersNum, 'holder')}
        </Text>
      ),
    }))
  }, [data])
  // todo add pagination after qa-v6 is merged
  return (
    <>
      <StyledTable
        minWidth={730}
        isEmpty={!mappingData.length}
        columns={COLUMNS}
        data={isLoading ? tableLoadingData : mappingData}
        emptyState={emptyState}
        pageSize={10}
      />
    </>
  )
}

const StyledTable = styled(Table)<{ isEmpty?: boolean }>`
  width: 100%;
  background: transparent;

  .table-base {
    height: fit-content;
  }

  .table-header {
    background-color: transparent;
    box-shadow: ${cVar('effectDividersBottom')};
  }

  .table-row {
    background-color: transparent;
  }

  th:nth-child(n + 3),
  th:nth-child(n + 4),
  th:nth-child(n + 5) {
    justify-content: end;
  }

  td:nth-child(n + 3),
  td:nth-child(n + 4),
  td:nth-child(n + 5) {
    align-items: end;

    > div {
      align-items: end;
    }
  }
`
