import { FC } from 'react'

import { useNfts } from '@/api/hooks/nfts'
import { OwnedNftOrderByInput, OwnedNftWhereInput } from '@/api/queries/__generated__/baseTypes.generated'
import { EmptyFallback } from '@/components/EmptyFallback'
import { Grid } from '@/components/Grid'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { NftTileViewer } from '@/components/_nft/NftTileViewer'
import { useUser } from '@/providers/user/user.hooks'
import { transitions } from '@/styles'
import { createPlaceholderData } from '@/utils/data'

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

const VIEWER_TIMESTAMP = new Date()

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

  const basicWhereVariablesWithoutFilter: OwnedNftWhereInput = {
    createdAt_lte: VIEWER_TIMESTAMP,
    video: {
      channel: {
        id_eq: channelId,
      },
      isPublic_eq: !channelOwner || undefined,
    },
  }
  // if OR is passed put every variable inside every element of OR
  const orVariablesFromFilter: OwnedNftWhereInput['OR'] = ownedNftWhereInput?.OR?.map((or) => ({
    ...basicWhereVariablesWithoutFilter,
    ...or,
  }))

  const { nfts, totalCount, loading, error, refetch } = useNfts({
    variables: {
      orderBy,
      limit: tilesPerPage,
      where: {
        ...(orVariablesFromFilter?.length
          ? { OR: orVariablesFromFilter }
          : { ...ownedNftWhereInput, ...basicWhereVariablesWithoutFilter }),
      },
      offset: currentPage * tilesPerPage,
    },
  })

  const handleChangePage = (page: number) => {
    refetch({ offset: page * tilesPerPage })
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
            title={isFiltersApplied ? 'No NFTs found' : 'No NFTs minted'}
            subtitle={isFiltersApplied ? 'Try changing the filters.' : `This channel hasn't minted any NFTs yet.`}
            variant="large"
          />
        )}
        <Grid maxColumns={null} onResize={onResize}>
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
