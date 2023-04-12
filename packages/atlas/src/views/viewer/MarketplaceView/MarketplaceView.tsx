import { FC, useState } from 'react'

import { useNfts } from '@/api/hooks/nfts'
import { OwnedNftOrderByInput, OwnedNftWhereInput } from '@/api/queries/__generated__/baseTypes.generated'
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

import { HeaderContainer, HeaderWrapper, StyledGrid } from './MarketplaceView.styles'

const SORT_OPTIONS = [
  { name: 'newest', value: OwnedNftOrderByInput.CreatedAtDesc },
  { name: 'oldest', value: OwnedNftOrderByInput.CreatedAtAsc },
]

const VIEWER_TIMESTAMP = new Date()

export const MarketplaceView: FC = () => {
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

  const basicVariables: OwnedNftWhereInput = {
    createdAt_lte: VIEWER_TIMESTAMP,
    createdAt_gte: videoWhereInput.createdAt_gte,
    video: {
      ...videoWhereInput,
      media: {
        isAccepted_eq: true,
      },
      thumbnailPhoto: {
        isAccepted_eq: true,
      },
      isPublic_eq: true,
      channel: {
        isPublic_eq: true,
      },
    },
  }

  const orVariablesFromFilter = ownedNftWhereInput.OR?.map((value) => ({
    ...basicVariables,
    ...value,
  }))

  const { nfts, loading, totalCount } = useNfts({
    variables: {
      where: {
        ...(orVariablesFromFilter?.length
          ? { OR: orVariablesFromFilter }
          : { ...ownedNftWhereInput, ...basicVariables }),
      },
      orderBy: sortBy,
      limit: tilesPerPage,
      offset: currentPage * tilesPerPage,
    },
    fetchPolicy: 'cache-first',
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
