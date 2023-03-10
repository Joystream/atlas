import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router'

import { OwnedNftOrderByInput, OwnedNftWhereInput } from '@/api/queries/__generated__/baseTypes.generated'
import { EmptyFallback } from '@/components/EmptyFallback'
import { Grid } from '@/components/Grid'
import { NftTileViewer } from '@/components/_nft/NftTileViewer'
import { useNfts } from '@/hooks/useNfts'
import { useVideoGridRows } from '@/hooks/useVideoGridRows'
import { useUser } from '@/providers/user/user.hooks'
import { createPlaceholderData } from '@/utils/data'

import { StyledPagination } from './MemberView.styles'

type MemberNFTsProps = {
  owner?: boolean
  isFiltersApplied?: boolean
  sortBy?: OwnedNftOrderByInput
  ownedNftWhereInput?: OwnedNftWhereInput

  setNftCount?: (count: number) => void
}

const INITIAL_TILES_PER_ROW = 4

const VIEWER_TIMESTAMP = new Date()

export const MemberNFTs: FC<MemberNFTsProps> = ({
  owner,
  isFiltersApplied,
  sortBy,
  ownedNftWhereInput,
  setNftCount,
}) => {
  const [tilesPerRow, setTilesPerRow] = useState(INITIAL_TILES_PER_ROW)
  const nftRows = useVideoGridRows('main')
  const tilesPerPage = nftRows * tilesPerRow
  const handleOnResizeGrid = (sizes: number[]) => setTilesPerRow(sizes.length)

  const { activeMembership } = useUser()
  const { handle } = useParams()

  const [currentPage, setCurrentPage] = useState(0)

  const {
    nfts,
    loading,
    totalCount: totalNftsCount,
    refetch,
  } = useNfts({
    variables: {
      where: {
        ownerMember: { handle_eq: handle },
        ...ownedNftWhereInput,
        createdAt_lte: VIEWER_TIMESTAMP,
        video: {
          isPublic_eq: handle !== activeMembership?.handle || undefined,
        },
      },
      orderBy: sortBy as OwnedNftOrderByInput,
      limit: tilesPerPage,
    },
    skip: !handle,
  })

  useEffect(() => {
    if (totalNftsCount) {
      setNftCount?.(totalNftsCount)
    }
  }, [setNftCount, totalNftsCount])

  const handleChangePage = (page: number) => {
    refetch({ offset: page * tilesPerPage })
    setCurrentPage(page)
  }

  return (
    <section>
      <Grid maxColumns={null} onResize={handleOnResizeGrid}>
        {(loading ? createPlaceholderData(tilesPerPage) : nfts ?? [])?.map((nft, idx) => (
          <NftTileViewer key={`${idx}-${nft.id}`} nftId={nft.id} />
        ))}
      </Grid>
      <StyledPagination
        onChangePage={handleChangePage}
        page={currentPage}
        itemsPerPage={tilesPerPage}
        totalCount={totalNftsCount}
      />
      {!loading && nfts && !nfts.length && (
        <EmptyFallback
          title={isFiltersApplied ? 'No NFTs found' : owner ? 'Start your collection' : 'No NFTs collected'}
          subtitle={
            isFiltersApplied
              ? 'Try changing the filters.'
              : owner
              ? 'Buy NFTs across the platform or create your own.'
              : "This member hasn't collected any NFTs yet."
          }
          variant="large"
        />
      )}
    </section>
  )
}
