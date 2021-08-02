import React from 'react'

import { BackgroundPattern, InfiniteChannelGrid } from '@/components'
import { transitions } from '@/shared/theme'
import { Header, StyledViewWrapper } from '@/views/viewer/VideosView/VideosView.style'

export const ChannelsView: React.FC = () => {
  return (
    <StyledViewWrapper>
      <BackgroundPattern />
      <Header variant="hero" className={transitions.names.slide}>
        Channels
      </Header>
      <InfiniteChannelGrid className={transitions.names.slide} />
    </StyledViewWrapper>
  )
}
