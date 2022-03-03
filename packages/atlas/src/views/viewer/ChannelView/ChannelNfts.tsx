import React from 'react'

import { useChannelNfts } from '@/api/hooks'
import { EmptyFallback } from '@/components/EmptyFallback'
import { Grid } from '@/components/Grid'
import { NftTileViewer } from '@/components/NftTileViewer'
import { transitions } from '@/styles'

import { VideoSection } from './ChannelView.styles'

type ChannelNftsProps = {
  searchQuery?: string
  isSearching?: boolean
  channelId: string
}

export const ChannelNfts: React.FC<ChannelNftsProps> = ({ searchQuery, isSearching, channelId }) => {
  const { nfts } = useChannelNfts(channelId)

  return (
    <VideoSection className={transitions.names.slide}>
      <Grid maxColumns={null}>
        {nfts?.map((nft, idx) => (
          <NftTileViewer key={nft?.id || idx} nftId={nft?.id} />
        ))}
      </Grid>
      {isSearching && <EmptyFallback title={`No NFTs matching "${searchQuery}" query found`} variant="small" />}
      {!isSearching && <EmptyFallback title="This channel does not have any NFTs issued yet" variant="small" />}
    </VideoSection>
  )
}
