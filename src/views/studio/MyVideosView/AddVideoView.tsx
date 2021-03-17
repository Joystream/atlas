import React from 'react'
import styled from '@emotion/styled'
import bgIllustration, { ReactComponent as WellIllustration } from '@/assets/well-blue.svg'
import { Button, Text } from '@/shared/components'
import { sizes, colors } from '@/shared/theme'
import { css } from '@emotion/react'

// for when there is absolutely no videos available
export const AddVideoView = () => {
  return (
    <ContainerView>
      <InnerContainerView>
        <MessageView>
          <Text variant="h3">Add your first video</Text>
          <Subtitle variant="body2">
            No videos available. Start the publisher journey by adding
            <br />
            you very first video to Joystream.
          </Subtitle>
        </MessageView>
        <div>
          <Button icon="video-camera">Upload video</Button>
        </div>
      </InnerContainerView>
      <WellIllustration />
    </ContainerView>
  )
}

const ContainerView = styled.div`
  height: 50vh;
  margin: ${sizes(20)} auto 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  > svg {
    max-width: 650px;
  }
`

const InnerContainerView = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const MessageView = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-top: 48px;
  margin-bottom: ${sizes(8)};
`

// for tabs
export const AddVideo = () => {
  return (
    <Container>
      <WellIllustration />
      <Message>
        <Text variant="h5">Add your first video</Text>
        <Subtitle variant="body2">
          No videos available. Start the publisher journey by
          <br />
          adding you very first video to Joystream.
        </Subtitle>
      </Message>
      <Button icon="video-camera">Upload video</Button>
    </Container>
  )
}

const Container = styled.div`
  margin: ${sizes(20)} auto 0;
  display: grid;
  place-items: center;
  > svg {
    max-width: 650px;
  }
`

const Message = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: 48px;
  margin-bottom: ${sizes(4)};
`

const Subtitle = styled(Text)`
  margin-top: 8px;
  color: ${colors.gray[300]};
`
