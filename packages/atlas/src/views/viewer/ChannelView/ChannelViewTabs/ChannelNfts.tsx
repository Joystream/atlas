import { FC } from 'react'

import { useNftsConnection } from '@/api/hooks/nfts'
import { OwnedNftOrderByInput, OwnedNftWhereInput } from '@/api/queries/__generated__/baseTypes.generated'
import { EmptyFallback } from '@/components/EmptyFallback'
import { Grid } from '@/components/Grid'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { NftTileViewer } from '@/components/_nft/NftTileViewer'
import { useUser } from '@/providers/user/user.hooks'
import { transitions } from '@/styles'

import { StyledPagination, VideoSection } from './ChannelViewTabs.styles'

import { usePagination } from '../ChannelView.hooks'

type ChannelNftsProps = {
  channelId: string
  onResize: (sizes: number[]) => void
  tilesPerPage: number
  ownedNftWhereInput?: OwnedNftWhereInput
  orderBy?: OwnedNftOrderByInput
  isFiltersApplied?: boolean
}

export const ChannelNfts: FC<ChannelNftsProps> = ({
  channelId,
  tilesPerPage,
  onResize,
  ownedNftWhereInput,
  orderBy,
  isFiltersApplied,
}) => {
  const { currentPage, setCurrentPage } = usePagination(0)
  const { memberships } = useUser()

  const userChannels = memberships?.map((membership) => membership.channels).flat()
  const channelOwner = userChannels?.map((channel) => channel.id).includes(channelId)
  const { nfts, totalCount, loading, error, fetchMore, pageInfo } = useNftsConnection({
    orderBy,
    where: {
      ...ownedNftWhereInput,
      creatorChannel: {
        id_eq: channelId,
      },
      video: {
        isPublic_eq: !channelOwner || undefined,
      },
    },
  })

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
          <EmptyFallback
            title={isFiltersApplied ? 'No NFTs found' : 'No NFTs minted'}
            subtitle={isFiltersApplied ? 'Try changing the filters.' : `This channel hasn't minted any NFTs yet.`}
            variant="large"
          />
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
