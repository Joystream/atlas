import React from 'react'

import { Button, Text } from '@/shared/components'

import { Container, Links, LinksContainer, TextContainer } from './ChannelAbout.style'

export const ChannelAbout = () => {
  return (
    <Container>
      <div>
        <TextContainer>
          <Text variant="h4">Description</Text>
          <Text variant="body1" secondary>
            Official channel of wildcrypto.com. Join us and follow our channel on Joystream! Wildcrypto.com has changed.
            Its a completely new video studio and a new approach to create videos about cryptocurrency. We prepare
            explainers, facts & myths, current news and touch on every aspect of crypto. Our motivation and diverse
            content prepared by specialists are the factors which make us stand out. We work together closely with many
            experts preparing content for this channel.
          </Text>
        </TextContainer>
        <LinksContainer>
          <Text variant="h4">Links</Text>
          <Links>
            <Button textOnly>content</Button>
            <Button textOnly>channel</Button>
            <Button textOnly>preparing</Button>
            <Button textOnly>Official channel</Button>
            <Button textOnly>wildcrypto.com</Button>
            <Button textOnly>content</Button>
            <Button textOnly>channel</Button>
            <Button textOnly>preparing</Button>
            <Button textOnly>Official channel</Button>
            <Button textOnly>wildcrypto.com</Button>
            <Button textOnly>content</Button>
            <Button textOnly>channel</Button>
            <Button textOnly>preparing</Button>
            <Button textOnly>Official channel</Button>
            <Button textOnly>wildcrypto.com</Button>
          </Links>
        </LinksContainer>
      </div>
      <div>sidebar</div>
    </Container>
  )
}
