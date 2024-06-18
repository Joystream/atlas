import styled from '@emotion/styled'
import BN from 'bn.js'
import { useMemo } from 'react'

import { TokenStatus } from '@/api/queries/__generated__/baseTypes.generated'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat } from '@/components/NumberFormat'
import { PercentageChangeIndicator } from '@/components/PercentageChangeIndicator'
import { Table, TableProps } from '@/components/Table'
import { ColumnBox } from '@/components/Table/Table.styles'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar } from '@/styles'
import { pluralizeNoun } from '@/utils/misc'
import { formatDate } from '@/utils/time'

import { CrtStatus, TokenInfo } from '../CrtPortfolioTable'

export const tableLoadingData = Array.from({ length: 10 }, () => ({
  token: (
    <ColumnBox>
      <SkeletonLoader rounded height={32} width={32} />
      <SkeletonLoader height={20} width="40%" />
    </ColumnBox>
  ),
  status: <SkeletonLoader height={20} width="60%" />,
  createdAt: <SkeletonLoader height={20} width="50%" />,
  marketCap: <SkeletonLoader height={20} width="50%" />,
  totalRevenue: <SkeletonLoader height={20} width="50%" />,
  holders: <SkeletonLoader height={20} width="50%" />,
}))

const COLUMNS: TableProps['columns'] = [
  { Header: 'Token', accessor: 'token', width: 1 },
  { Header: 'Date created', accessor: 'createdAt', width: 1 },
  { Header: 'Price % 24h', accessor: 'dailyPriceChange', width: 1 },
  { Header: 'Price', accessor: 'price', width: 1 },
  { Header: 'Liq % 7d', accessor: 'liquidityChange', width: 1 },
  { Header: 'Liquidity', accessor: 'liquidity', width: 1 },
  { Header: 'Tranding vol.', accessor: 'tradingVolume', width: 1 },
  { Header: 'Status', accessor: 'status', width: 1 },
  { Header: 'Market cap', accessor: 'marketCap', width: 1 },
  { Header: 'Total rev.', accessor: 'totalRevenue', width: 1 },
  { Header: 'Holders', accessor: 'holders', width: 1 },
]

export type MarketplaceToken = {
  tokenTitle: string
  tokenName: string
  isVerified: boolean
  status: TokenStatus
  createdAt: Date
  marketCap: BN
  totalRevenue: BN
  holdersNum: number
  channelId: string
  lastDayPriceChange: number
  ammVolume: BN
  weeklyLiqChange: number
  liquidity: number
  lastPrice: BN
}

export type MarketplaceCrtTableProps = {
  data: MarketplaceToken[]
  isLoading: boolean
  emptyState?: TableProps['emptyState']
} & Pick<
  TableProps,
  | 'pagination'
  | 'pageSize'
  | 'getRowTo'
  | 'interactive'
  | 'onColumnSortClick'
  | 'sortSupportedColumnsIds'
  | 'defaultSorting'
>

export const MarketplaceCrtTable = ({ data, emptyState, isLoading, ...tableProps }: MarketplaceCrtTableProps) => {
  const mappingData = useMemo(() => {
    return data.map((row) => ({
      token: <TokenInfo {...row} />,
      createdAt: (
        <Text variant="t100" as="p">
          {formatDate(row.createdAt)}
        </Text>
      ),
      dailyPriceChange: (
        <span>
          <PercentageChangeIndicator value={row.lastDayPriceChange} />
        </span>
      ),
      price: (
        <NumberFormat
          icon={<JoyTokenIcon size={16} variant="gray" />}
          format="short"
          withDenomination
          value={row.lastPrice}
          as="p"
        />
      ),
      liquidityChange: (
        <span>
          <PercentageChangeIndicator value={row.weeklyLiqChange} />
        </span>
      ),
      liquidity: (
        <NumberFormat
          icon={<JoyTokenIcon size={16} variant="gray" />}
          format="short"
          withDenomination
          value={row.liquidity}
          as="p"
        />
      ),
      tradingVolume: (
        <NumberFormat
          icon={<JoyTokenIcon size={16} variant="gray" />}
          format="short"
          withDenomination
          value={row.ammVolume}
          as="p"
        />
      ),
      status: <CrtStatus status={row.status} />,
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

  return (
    <>
      <StyledTable
        minWidth={730}
        isEmpty={!mappingData.length}
        columns={COLUMNS}
        data={isLoading ? tableLoadingData : mappingData}
        emptyState={emptyState}
        {...tableProps}
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

  th:nth-child(n + 2),
  th:nth-child(n + 3),
  th:nth-child(n + 4),
  th:nth-child(n + 5),
  th:nth-child(n + 6),
  th:nth-child(n + 7) {
    justify-content: end;
  }

  td:nth-child(n + 2),
  td:nth-child(n + 3),
  td:nth-child(n + 4),
  td:nth-child(n + 5),
  td:nth-child(n + 6),
  td:nth-child(n + 7) {
    align-items: end;
    text-align: right;

    > div {
      align-items: end;
      justify-content: end;
    }
  }
`
