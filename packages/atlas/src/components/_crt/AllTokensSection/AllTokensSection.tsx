import BN from 'bn.js'

import { FallbackContainer } from '@/components/AllNftSection'
import { EmptyFallback } from '@/components/EmptyFallback'
import { NumberFormat } from '@/components/NumberFormat'
import { Section } from '@/components/Section/Section'
import { Button } from '@/components/_buttons/Button'
import { MarketplaceCrtTable } from '@/components/_crt/MarketplaceCrtTable'
import { absoluteRoutes } from '@/config/routes'
import { useCrtSectionFilters } from '@/hooks/useCrtSectionFilters'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useTokensPagination } from '@/hooks/useTokensPagniation'

export const AllTokensSection = () => {
  const smMatch = useMediaMatch('sm')
  const {
    creatorTokenWhereInput,
    order,
    hasAppliedFilters,
    rawFilters,
    sortSupportedColumns,
    actions: { onApplyFilters, setOrder, clearFilters },
  } = useCrtSectionFilters()

  const { tokens, currentPage, setCurrentPage, isLoading, totalCount, setPerPage, perPage } = useTokensPagination({
    where: creatorTokenWhereInput,
    orderBy: [order],
  })

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
        weeklyLiqChange,
        lastDayPriceChange,
        marketCap,
      }) => ({
        createdAt: new Date(createdAt),
        totalRevenue: new BN(cumulativeRevenue ?? 0),
        holdersNum: accountsNum,
        isVerified: false,
        marketCap: new BN(marketCap ?? 0),
        status,
        channelId: '', //channel?.channel.id ?? '',
        lastPrice: new BN(lastPrice ?? 0),
        tokenName: symbol ?? 'N/A',
        tokenTitle: symbol ?? 'N/A',
        ammVolume: new BN(ammVolume ?? 0),
        liquidity: liquidity ?? 0,
        weeklyLiqChange: +weeklyLiqChange,
        lastDayPriceChange: +lastDayPriceChange,
      })
    ) ?? []

  return (
    <Section
      headerProps={{
        onApplyFilters,
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
                  interactive
                  isLoading={isLoading}
                  pageSize={perPage}
                  onColumnSortClick={setOrder}
                  defaultSorting={['holders', true]}
                  sortSupportedColumnsIds={sortSupportedColumns}
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
