import React from 'react'
import { Header, StyledViewWrapper } from '@/views/viewer/VideosView/VideosView.style'
import { BackgroundPattern, InfiniteChannelGrid } from '@/components'
import { transitions } from '@/shared/theme'

const ChannelsView: React.FC = () => {
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

export default ChannelsView
