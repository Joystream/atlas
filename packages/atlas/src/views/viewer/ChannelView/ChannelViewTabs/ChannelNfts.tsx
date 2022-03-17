import React from 'react'

import { useChannelNfts } from '@/api/hooks'
import { VideoCategoryWhereInput, VideoOrderByInput } from '@/api/queries'
import { EmptyFallback } from '@/components/EmptyFallback'
import { Grid } from '@/components/Grid'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { NftTileViewer } from '@/components/_nft/NftTileViewer'
import { transitions } from '@/styles'

import { StyledPagination, VideoSection } from './ChannelViewTabs.styles'

import { usePagination } from '../ChannelView.hooks'

type ChannelNftsProps = {
  channelId: string
  sortNftsBy?: VideoOrderByInput
  category?: VideoCategoryWhereInput | null
  onResize: (sizes: number[]) => void
  tilesPerPage: number
}

export const ChannelNfts: React.FC<ChannelNftsProps> = ({
  channelId,
  tilesPerPage,
  category,
  sortNftsBy,
  onResize,
}) => {
  const { currentPage, setCurrentPage } = usePagination(0)

  const { nfts, totalCount, loading, error, fetchMore, pageInfo } = useChannelNfts(channelId, { category, sortNftsBy })

  const paginatedNfts = (nfts || []).slice(currentPage * tilesPerPage, currentPage * tilesPerPage + tilesPerPage)

  const placeholderItems = Array.from(
    { length: loading ? tilesPerPage - (paginatedNfts ? paginatedNfts.length : 0) : 0 },
    () => ({
      id: undefined,
    })
  )

  const handleChangePage = (page: number) => {
    setCurrentPage(page)
    if (!!nfts && page * tilesPerPage + tilesPerPage > nfts?.length && nfts?.length < (totalCount ?? 0)) {
      fetchMore({
        variables: {
          first: page * tilesPerPage + tilesPerPage * 3 - nfts?.length,
          after: pageInfo?.endCursor,
        },
      })
    }
  }

  const nftsWithPlaceholders = [...(paginatedNfts || []), ...placeholderItems]

  if (error) {
    return <ViewErrorFallback />
  }

  return (
    <>
      <VideoSection className={transitions.names.slide}>
        {!nftsWithPlaceholders.length && (
          <EmptyFallback title="This channel does not have any NFTs issued yet" variant="small" />
        )}
        <Grid maxColumns={null} onResize={onResize}>
          {nftsWithPlaceholders?.map((nft, idx) => (
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
