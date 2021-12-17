import styled from '@emotion/styled'
import React from 'react'

import { ChannelOrderByInput, GetMostFollowedChannelsDocument } from '@/api/queries'
import { InfiniteChannelWithVideosGrid } from '@/components/InfiniteGrids'
import { sizes } from '@/styles'

type DiscoverChannelsProps = {
  additionalLink?: {
    name: string
    url: string
  }
}

export const DiscoverChannels: React.FC<DiscoverChannelsProps> = ({ additionalLink }) => {
  return (
    <StyledInfiniteChannelWithVideosGrid
      title="Discover new channels"
      query={GetMostFollowedChannelsDocument}
      onDemand
      first={10}
      limit={30}
      timePeriodDays={30}
      orderBy={ChannelOrderByInput.CreatedAtDesc}
      additionalLink={additionalLink}
    />
  )
}

const StyledInfiniteChannelWithVideosGrid = styled(InfiniteChannelWithVideosGrid)`
  :not(:last-of-type) {
    margin-bottom: ${sizes(38)};
  }
`
