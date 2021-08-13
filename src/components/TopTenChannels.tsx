import styled from '@emotion/styled'
import React from 'react'

import { useMostFollowedChannelsAllTime } from '@/api/hooks'
import { sizes } from '@/shared/theme'

import { ChannelGallery } from './ChannelGallery'

export const TopTenChannels = () => {
  const { channels, loading } = useMostFollowedChannelsAllTime({ limit: 10 })

  const isLoading = loading || channels === null
  return (
    <Wrapper>
      <ChannelGallery hasRanking channels={channels} loading={isLoading} title="Top 10 Channels" />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin-top: ${sizes(18)};
`
