import BN from 'bn.js'

import { FallbackContainer } from '@/components/AllNftSection'
import { EmptyFallback } from '@/components/EmptyFallback'
import { NumberFormat } from '@/components/NumberFormat'
import { Section } from '@/components/Section/Section'
import { Button } from '@/components/_buttons/Button'
import { MarketplaceCrtTable } from '@/components/_crt/MarketplaceCrtTable'
import { SORTING_FILTERS, useCrtSectionFilters } from '@/hooks/useCrtSectionFilters'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useTokensPagination } from '@/hooks/useTokensPagniation'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'

export const AllTokensSection = () => {
  const smMatch = useMediaMatch('sm')
  const {
    creatorTokenWhereInput,
    order,
    hasAppliedFilters,
    rawFilters,
    actions: { onApplyFilters, setOrder, clearFilters },
  } = useCrtSectionFilters()

  const { tokens, currentPage, setCurrentPage, isLoading, totalCount, setPerPage, perPage } = useTokensPagination({
    where: creatorTokenWhereInput,
    orderBy: order,
  })

  const tableData =
    tokens?.map(({ createdAt, accountsNum, lastPrice, totalSupply, status, symbol, channel }) => ({
      createdAt: new Date(createdAt),
      totalRevenue: 0,
      holdersNum: accountsNum,
      isVerified: true,
      marketCap: lastPrice && totalSupply ? hapiBnToTokenNumber(new BN(lastPrice).mul(new BN(totalSupply))) ?? 0 : 0,
      status,
      channelId: channel?.channel.id ?? '',
      tokenName: symbol ?? 'N/A',
      tokenTitle: symbol ?? 'N/A',
    })) ?? []

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
        sort: {
          type: 'toggle-button',
          toggleButtonOptionTypeProps: {
            type: 'options',
            options: SORTING_FILTERS,
            value: order,
            onChange: setOrder,
          },
        },
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
                  isLoading={isLoading}
                  pageSize={perPage}
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
