import React from 'react'
import { Container } from '@/views/LayoutWithRouting'
import { Header } from '@/views/VideosView/VideosView.style'
import { BackgroundPattern, InfiniteChannelGrid } from '@/components'
import { transitions } from '@/shared/theme'

const ChannelsView: React.FC = () => {
  return (
    <Container>
      <BackgroundPattern />
      <Header variant="hero" className={transitions.names.slide}>
        Channels
      </Header>
      <InfiniteChannelGrid className={transitions.names.slide} />
    </Container>
  )
}

export default ChannelsView
