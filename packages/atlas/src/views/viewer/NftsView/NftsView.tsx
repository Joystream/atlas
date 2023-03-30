import { FC, useState } from 'react'

import { useNfts } from '@/api/hooks/nfts'
import { OwnedNftOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { SvgActionFilters } from '@/assets/icons'
import { EmptyFallback } from '@/components/EmptyFallback'
import { FiltersBar, useFiltersBar } from '@/components/FiltersBar'
import { GridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { Select } from '@/components/_inputs/Select'
import { NftTileViewer } from '@/components/_nft/NftTileViewer'
import { VideoContentTemplate } from '@/components/_templates/VideoContentTemplate'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useVideoGridRows } from '@/hooks/useVideoGridRows'
import { createPlaceholderData } from '@/utils/data'
import { SentryLogger } from '@/utils/logs'
import { StyledPagination } from '@/views/studio/MyVideosView/MyVideos.styles'

import { HeaderContainer, HeaderWrapper, StyledGrid } from './NftsView.styles'

const SORT_OPTIONS = [
  { name: 'newest', value: OwnedNftOrderByInput.CreatedAtDesc },
  { name: 'oldest', value: OwnedNftOrderByInput.CreatedAtAsc },
]

const VIEWER_TIMESTAMP = new Date()

export const NftsView: FC = () => {
  const headTags = useHeadTags('Video NFTs')
  const smMatch = useMediaMatch('sm')
  const mdMatch = useMediaMatch('md')
  const filtersBarLogic = useFiltersBar()
  const {
    filters: { setIsFiltersOpen, isFiltersOpen },
    canClearFilters: { canClearAllFilters },
    ownedNftWhereInput,
    videoWhereInput,
  } = filtersBarLogic

  const [sortBy, setSortBy] = useState<OwnedNftOrderByInput>(OwnedNftOrderByInput.CreatedAtDesc)
  const [currentPage, setCurrentPage] = useState(0)
  const [tilesPerRow, setTilesPerRow] = useState(4)
  const nftRows = useVideoGridRows('main')
  const tilesPerPage = nftRows * tilesPerRow

  const { nfts, loading, totalCount, refetch } = useNfts({
    variables: {
      where: {
        ...ownedNftWhereInput,
        createdAt_gte: videoWhereInput.createdAt_gte,
        createdAt_lte: VIEWER_TIMESTAMP,
        video:
          videoWhereInput.hasMarketing_eq != null || videoWhereInput.isExplicit_eq != null
            ? {
                hasMarketing_eq: videoWhereInput.hasMarketing_eq,
                isExplicit_eq: videoWhereInput.isExplicit_eq,
              }
            : undefined,
      },
      orderBy: sortBy,
      limit: tilesPerPage,
      offset: currentPage * tilesPerPage,
    },
    notifyOnNetworkStatusChange: true,
    onError: (error) => SentryLogger.error('Failed to fetch NFTs', 'NftsView', error),
  })

  const handleResizeGrid = (sizes: number[]) => setTilesPerRow(sizes.length)

  const handleSortingChange = (value?: OwnedNftOrderByInput | null) => {
    if (value) {
      setSortBy(value)
    }
  }

  const handleFilterClick = () => {
    setIsFiltersOpen((value) => !value)
  }

  const handleChangePage = (page: number) => {
    refetch({ offset: page * tilesPerPage })
    setCurrentPage(page)
  }

  const sortingNode = (
    <Select size="medium" value={sortBy} inlineLabel="Sort by" items={SORT_OPTIONS} onChange={handleSortingChange} />
  )

  return (
    <VideoContentTemplate title="Video NFTs">
      {headTags}
      <HeaderWrapper>
        <HeaderContainer>
          <GridItem colSpan={{ base: 2, sm: 1 }}>
            <Text as="p" variant={mdMatch ? 'h500' : 'h400'}>
              All NFTs {totalCount !== undefined && `(${totalCount})`}
            </Text>
          </GridItem>
          {!smMatch && sortingNode}
          <div>
            <Button
              badge={canClearAllFilters}
              variant="secondary"
              icon={<SvgActionFilters />}
              onClick={handleFilterClick}
            >
              Filters
            </Button>
          </div>
          {smMatch && sortingNode}
        </HeaderContainer>
        <FiltersBar
          {...filtersBarLogic}
          onAnyFilterSet={() => setCurrentPage(0)}
          activeFilters={['nftStatus', 'date-minted', 'other']}
        />
      </HeaderWrapper>
      <StyledGrid maxColumns={null} onResize={handleResizeGrid} isFiltersOpen={isFiltersOpen}>
        {(loading ? createPlaceholderData(tilesPerPage) : nfts ?? []).map((nft, idx) => (
          <NftTileViewer key={`${idx}-${nft.id}`} nftId={nft.id} />
        ))}
      </StyledGrid>
      {nfts && !nfts.length && (
        <EmptyFallback
          title="No NFTs found"
          subtitle={canClearAllFilters ? 'Try changing the filters.' : 'No NFTs were minted yet.'}
          variant="large"
        />
      )}
      <StyledPagination
        onChangePage={handleChangePage}
        page={currentPage}
        itemsPerPage={tilesPerPage}
        totalCount={totalCount}
      />
    </VideoContentTemplate>
  )
}
