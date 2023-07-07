import styled from '@emotion/styled'

import { EmptyFallback } from '@/components/EmptyFallback'
import { SectionFilter } from '@/components/FilterButton'
import { Section } from '@/components/Section/Section'
import { Button } from '@/components/_buttons/Button'
import { NftTileViewer } from '@/components/_nft/NftTileViewer'
import { useInfiniteNftsGrid } from '@/hooks/useInfiniteNftsGrid'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { SORTING_FILTERS, useNftSectionFilters } from '@/hooks/useNftSectionFilters'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { DEFAULT_NFTS_GRID } from '@/styles'
import { InfiniteLoadingOffsets } from '@/utils/loading.contants'

import { NumberFormat } from '../NumberFormat'

export const AllNftSection = () => {
  const smMatch = useMediaMatch('sm')
  const {
    ownedNftWhereInput,
    order,
    hasAppliedFilters,
    rawFilters,
    actions: { onApplyFilters, setOrder, clearFilters },
  } = useNftSectionFilters()

  const { trackAllNftFilterUpdated } = useSegmentAnalytics()

  const onApplyFiltersCallback = (appliedFilters: SectionFilter[]) => {
    const status = appliedFilters.find((filter) => filter.name === 'status')
    const price = appliedFilters.find((filter) => filter.name === 'price')
    trackAllNftFilterUpdated(status?.range?.toString(), price?.range?.toString(), order)
    onApplyFilters(appliedFilters)
  }

  const { columns, fetchMore, pageInfo, tiles, totalCount } = useInfiniteNftsGrid({
    where: ownedNftWhereInput,
    orderBy: order,
  })

  const children = tiles?.map((nft, idx) => <NftTileViewer key={idx} nftId={nft.id} />)
  return (
    <Section
      headerProps={{
        onApplyFilters: onApplyFiltersCallback,
        start: {
          type: 'title',
          title: 'All NFTs',
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
        grid: DEFAULT_NFTS_GRID,
        children: children.length
          ? children
          : [
              <FallbackContainer key="fallback">
                <EmptyFallback
                  title="No NFTs found"
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
      footerProps={{
        type: 'infinite',
        loadingTriggerOffset: InfiniteLoadingOffsets.NftTile,
        reachedEnd: !pageInfo?.hasNextPage ?? true,
        fetchMore: async () => {
          if (pageInfo?.hasNextPage) {
            await fetchMore({
              variables: {
                first: columns * 4,
                after: pageInfo?.endCursor,
              },
            })
          }
        },
      }}
    />
  )
}

export const FallbackContainer = styled.div`
  grid-column: 1/-1;
`
