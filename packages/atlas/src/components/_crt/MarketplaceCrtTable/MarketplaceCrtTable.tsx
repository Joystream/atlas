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
      <SkeletonLoader height={20} width="60%" />
    </ColumnBox>
  ),
  status: <SkeletonLoader height={32} width="80%" />,
  priceChange: <SkeletonLoader height={32} width="80%" />,
  price: <SkeletonLoader height={32} width="80%" />,
  liquidityChange: <SkeletonLoader height={32} width="80%" />,
  liquidity: <SkeletonLoader height={32} width="80%" />,
  tradingVolume: <SkeletonLoader height={32} width="80%" />,
  createdAt: <SkeletonLoader height={32} width="80%" />,
  marketCap: <SkeletonLoader height={32} width="80%" />,
  totalRevenue: <SkeletonLoader height={32} width="80%" />,
  holders: <SkeletonLoader height={42} width="80%" />,
}))

const COLUMNS: TableProps['columns'] = [
  { Header: 'Token', accessor: 'token', width: 2 },
  { Header: 'Date created', accessor: 'createdAt', width: 2 },
  { Header: 'Price % 30d', accessor: 'priceChange', width: 2 },
  { Header: 'Price', accessor: 'price', width: 2 },
  { Header: 'Liq % 30d', accessor: 'liquidityChange', width: 2 },
  { Header: 'Liquidity', accessor: 'liquidity', width: 2 },
  { Header: 'Tranding vol.', accessor: 'tradingVolume', width: 2 },
  { Header: 'Status', accessor: 'status', width: 1 },
  { Header: 'Market cap', accessor: 'marketCap', width: 2 },
  { Header: 'Total rev.', accessor: 'totalRevenue', width: 2 },
  { Header: 'Holders', accessor: 'holders', width: 2 },
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
  priceChange: number
  ammVolume: BN
  liquidityChange: number
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
  | 'onRowClick'
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
      priceChange: (
        <span>
          <PercentageChangeIndicator value={row.priceChange} />
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
          <PercentageChangeIndicator value={row.liquidityChange} />
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
      marketCap: !row.marketCap.isZero() ? (
        <NumberFormat
          icon={<JoyTokenIcon size={16} variant="gray" />}
          format="short"
          withDenomination
          value={row.marketCap}
          as="p"
        />
      ) : (
        '–'
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
        minWidth={1200}
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
