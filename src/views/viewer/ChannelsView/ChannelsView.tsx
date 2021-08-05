import styled from '@emotion/styled'
import React from 'react'

import { InfiniteChannelWithVideosGrid, ViewWrapper } from '@/components'
import { Text } from '@/shared/components'
import { sizes } from '@/shared/theme'

export const ChannelsView = () => {
  return (
    <StyledViewWrapper>
      <Header variant="h2">Browse channels</Header>
      <InfiniteChannelWithVideosGrid title="Channels in your language:" languageSelector onDemand />
    </StyledViewWrapper>
  )
}

const Header = styled(Text)`
  margin: ${sizes(16)} 0;
`

const StyledViewWrapper = styled(ViewWrapper)`
  padding-bottom: ${sizes(10)};
`
