import BN from 'bn.js'

import { FallbackContainer } from '@/components/AllNftSection'
import { EmptyFallback } from '@/components/EmptyFallback'
import { NumberFormat } from '@/components/NumberFormat'
import { Section } from '@/components/Section/Section'
import { Button } from '@/components/_buttons/Button'
import { MarketplaceCrtTable } from '@/components/_crt/MarketplaceCrtTable'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useTokensPagination } from '@/hooks/useTokensPagniation'
import { sendUserInteraction } from '@/utils/interactions'

export const AllTokensSection = () => {
  const smMatch = useMediaMatch('sm')

  const {
    tokens,
    currentPage,
    setCurrentPage,
    isLoading,
    totalCount,
    setPerPage,
    perPage,
    onApplyFilters,
    hasAppliedFilters,
    rawFilters,
    sortMappings,
    setOrder,
    orderBy,
    clearFilters,
    search,
    setSearch,
  } = useTokensPagination({})

  const tableData =
    tokens?.map(
      ({
        createdAt,
        accountsNum,
        lastPrice,
        status,
        symbol,
        cumulativeRevenue,
        ammVolume,
        liquidity,
        liquidityChange,
        priceChange,
        marketCap,
        channelId,
      }) => ({
        createdAt: new Date(createdAt),
        totalRevenue: new BN(cumulativeRevenue ?? 0),
        holdersNum: accountsNum,
        isVerified: false,
        marketCap: new BN(marketCap ?? 0),
        status,
        channelId: channelId ?? '',
        lastPrice: new BN(lastPrice ?? 0),
        tokenName: symbol ?? 'N/A',
        tokenTitle: symbol ?? 'N/A',
        ammVolume: new BN(ammVolume ?? 0),
        liquidity: liquidity ?? 0,
        liquidityChange: +(liquidityChange ?? 0),
        priceChange: +(priceChange ?? 0),
      })
    ) ?? []
  const currentSortingTableColumn = Object.entries(sortMappings).find(([, mapping]) => mapping.includes(orderBy))

  return (
    <Section
      headerProps={{
        onApplyFilters,
        search: {
          value: search,
          onChange: (e) => setSearch(e.target.value),
        },
        start: {
          type: 'title',
          title: 'All Creator Tokens',
          nodeEnd:
            typeof totalCount === 'number' ? (
              <NumberFormat value={totalCount} as="p" variant={smMatch ? 'h500' : 'h400'} color="colorTextMuted" />
            ) : undefined,
        },
        filters: rawFilters,
      }}
      contentProps={{
        type: 'grid',
        grid: { xxs: { columns: 1 } },
        children:
          tableData.length || isLoading
            ? [
                <MarketplaceCrtTable
                  key="single-table"
                  data={tableData}
                  getRowTo={(idx) => absoluteRoutes.viewer.channel(tableData[idx]?.channelId ?? '', { tab: 'Token' })}
                  onRowClick={(idx) => {
                    if (tokens?.[idx].id) {
                      sendUserInteraction('MarketplaceTokenEntry', tokens[idx].id).catch(() => undefined)
                    }
                  }}
                  interactive
                  isLoading={isLoading}
                  pageSize={perPage}
                  defaultSorting={
                    currentSortingTableColumn
                      ? [currentSortingTableColumn[0], currentSortingTableColumn[1][0] === orderBy]
                      : undefined
                  }
                  onColumnSortClick={setOrder}
                  sortSupportedColumnsIds={Object.keys(sortMappings)}
                  pagination={{
                    setPerPage,
                    totalCount,
                    itemsPerPage: perPage,
                    page: currentPage,
                    onChangePage: setCurrentPage,
                  }}
                />,
              ]
            : [
                <FallbackContainer key="fallback">
                  <EmptyFallback
                    title="No CRTs found"
                    subtitle="Please, try changing your filtering criteria."
                    button={
                      hasAppliedFilters && (
                        <Button variant="secondary" onClick={() => clearFilters()}>
                          Clear all filters
                        </Button>
                      )
                    }
                  />
                </FallbackContainer>,
              ],
      }}
    />
  )
}
