import { useState } from 'react'

import { useNfts } from '@/api/hooks/nfts'
import { OwnedNftOrderByInput, OwnedNftWhereInput } from '@/api/queries/__generated__/baseTypes.generated'
import { EmptyFallback } from '@/components/EmptyFallback'
import { Grid } from '@/components/Grid'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { Button } from '@/components/_buttons/Button'
import { NftTileViewer } from '@/components/_nft/NftTileViewer'
import { absoluteRoutes } from '@/config/routes'
import { useVideoGridRows } from '@/hooks/useVideoGridRows'
import { useUser } from '@/providers/user/user.hooks'
import { transitions } from '@/styles'
import { createPlaceholderData } from '@/utils/data'
import { usePagination } from '@/views/viewer/ChannelView/ChannelView.hooks'
import { StyledPagination, VideoSection } from '@/views/viewer/ChannelView/ChannelViewTabs/ChannelViewTabs.styles'

const VIEWER_TIMESTAMP = new Date()

export const PortfolioNftTab = () => {
  const { currentPage, setCurrentPage } = usePagination(0)
  const { memberId } = useUser()
  const videoRows = useVideoGridRows('main')
  const [tilesPerRow, setTilesPerRow] = useState(4)

  const handleOnResizeGrid = (sizes: number[]) => setTilesPerRow(sizes.length)

  const basicWhereVariablesWithoutFilter: OwnedNftWhereInput = {
    createdAt_lte: VIEWER_TIMESTAMP,
    owner: {
      member: {
        id_eq: memberId,
      },
    },
  }

  const tilesPerPage = videoRows * tilesPerRow
  const { nfts, totalCount, loading, error } = useNfts({
    variables: {
      orderBy: OwnedNftOrderByInput.CreatedAtDesc,
      limit: tilesPerPage,
      where: basicWhereVariablesWithoutFilter,
      offset: currentPage * tilesPerPage,
    },
  })

  const handleChangePage = (page: number) => {
    setCurrentPage(page)
  }

  if (error) {
    return <ViewErrorFallback />
  }

  return (
    <>
      <VideoSection className={transitions.names.slide}>
        {!loading && !nfts?.length && (
          <EmptyFallback
            title="You don’t own any NFTs yet"
            subtitle="When you buy any NFTs you will be able to manage them and view from this page."
            button={
              <Button size="large" variant="secondary" to={absoluteRoutes.viewer.nftMarketplace()}>
                Explore NFTs
              </Button>
            }
            variant="large"
          />
        )}
        <Grid maxColumns={null} onResize={handleOnResizeGrid}>
          {(loading ? createPlaceholderData(tilesPerPage) : nfts ?? [])?.map((nft, idx) => (
            <NftTileViewer key={`${nft.id}-${idx}`} nftId={nft.id} />
          ))}
        </Grid>
      </VideoSection>
      <StyledPagination
        onChangePage={handleChangePage}
        page={currentPage}
        itemsPerPage={tilesPerPage}
        totalCount={totalCount}
        maxPaginationLinks={7}
      />
    </>
  )
}
