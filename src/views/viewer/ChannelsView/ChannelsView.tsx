import styled from '@emotion/styled'
import React, { useState } from 'react'

import { useMostFollowedChannelsAllTimeIds } from '@/api/hooks'
import { InfiniteChannelWithVideosGrid, TopTenChannels, ViewWrapper } from '@/components'
import { absoluteRoutes } from '@/config/routes'
import { CallToActionButton, CallToActionWrapper, Text } from '@/shared/components'
import { SvgNavHome, SvgNavNew, SvgNavPopular } from '@/shared/icons'
import { sizes } from '@/shared/theme'

const INITIAL_MOST_FOLLOWED_CHANNELS_LIMIT = 3
const MOST_FOLLOWED_CHANNELS_LIMIT = 15

export const ChannelsView = () => {
  const [mostFollowedChannelsAllTimeLimit, setMostFollowedChannelsAllTimeLimit] = useState(
    INITIAL_MOST_FOLLOWED_CHANNELS_LIMIT
  )
  const { mostFollowedChannelsAllTime } = useMostFollowedChannelsAllTimeIds({
    limit: mostFollowedChannelsAllTimeLimit,
  })
  const mostFollowedChannelsAllTimeIds = mostFollowedChannelsAllTime?.map((item) => item.id)
  const increaseMostFollowedChannelsAllTimeLimit = () => {
    if (mostFollowedChannelsAllTimeLimit <= MOST_FOLLOWED_CHANNELS_LIMIT) {
      setMostFollowedChannelsAllTimeLimit((prevState) => prevState + INITIAL_MOST_FOLLOWED_CHANNELS_LIMIT)
    }
  }

  return (
    <StyledViewWrapper>
      <Header variant="h2">Browse channels</Header>
      <TopTenChannels />
      <StyledInfiniteChannelWithVideosGrid
        title="Discover channels"
        onDemand
        idIn={mostFollowedChannelsAllTimeIds}
        onLoadMoreClick={increaseMostFollowedChannelsAllTimeLimit}
        sortBy="follows"
        maximumCount={MOST_FOLLOWED_CHANNELS_LIMIT}
      />
      <StyledInfiniteChannelWithVideosGrid title="Channels in your language" languageSelector onDemand />
      <CallToActionWrapper>
        <CallToActionButton
          label="Popular on Joystream"
          to={absoluteRoutes.viewer.popular()}
          colorVariant="red"
          icon={<SvgNavPopular />}
        />
        <CallToActionButton
          label="New & Noteworthy"
          to={absoluteRoutes.viewer.new()}
          colorVariant="green"
          icon={<SvgNavNew />}
        />
        <CallToActionButton
          label="Home"
          to={absoluteRoutes.viewer.index()}
          colorVariant="yellow"
          icon={<SvgNavHome />}
        />
      </CallToActionWrapper>
    </StyledViewWrapper>
  )
}

const Header = styled(Text)`
  margin: ${sizes(16)} 0;
`

const StyledViewWrapper = styled(ViewWrapper)`
  padding-bottom: ${sizes(10)};
`

const StyledInfiniteChannelWithVideosGrid = styled(InfiniteChannelWithVideosGrid)`
  :not(:last-of-type) {
    margin-bottom: ${sizes(38)};
  }
`
