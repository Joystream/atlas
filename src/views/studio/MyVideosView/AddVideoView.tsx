import React from 'react'
import styled from '@emotion/styled'
import { ReactComponent as WellIllustration } from '@/assets/well-blue.svg'
import { Button, Text } from '@/shared/components'
import { sizes, colors } from '@/shared/theme'

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

export const AddVideoView = () => {
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
