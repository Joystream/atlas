import React from 'react'

import { EmptyFallback } from '@/components/EmptyFallback'
import { transitions } from '@/styles'

import { VideoSection } from './ChannelView.styles'

type ChannelNftsProps = {
  searchQuery?: string
  isSearching?: boolean
}

export const ChannelNfts: React.FC<ChannelNftsProps> = ({ searchQuery, isSearching }) => {
  return (
    <VideoSection className={transitions.names.slide}>
      {isSearching && <EmptyFallback title={`No NFTs matching "${searchQuery}" query found`} variant="small" />}
      {!isSearching && <EmptyFallback title="This channel does not have any NFTs issued yet" variant="small" />}
    </VideoSection>
  )
}
