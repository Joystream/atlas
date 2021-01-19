import React from 'react'
import { Container, Header } from '@/views/BrowseView/BrowseView.style'
import { BackgroundPattern, InfiniteChannelGrid } from '@/components'

const ChannelsView: React.FC = () => {
  return (
    <Container>
      <BackgroundPattern />
      <Header variant="hero">Channels</Header>
      <InfiniteChannelGrid />
    </Container>
  )
}

export default ChannelsView
