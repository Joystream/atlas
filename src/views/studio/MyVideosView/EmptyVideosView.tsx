import React from 'react'
import styled from '@emotion/styled'
import bgIllustration, { ReactComponent as WellIllustration } from '@/assets/well-blue.svg'
import { Button, Text } from '@/shared/components'
import { sizes, colors, breakpoints } from '@/shared/theme'
import { css } from '@emotion/react'

// for when there is absolutely no videos available
export const EmptyVideosView: React.FC = () => {
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
      <StyledWellIllustration />
    </ContainerView>
  )
}

const StyledWellIllustration = styled(WellIllustration)`
  max-width: 300px;
  margin: 0 auto;
  grid-row-start: 1;
  @media screen and (min-width: ${breakpoints.medium}) {
    max-width: initial;
    grid-row-start: initial;
  }
`

const ContainerView = styled.div`
  display: grid;
  padding: 0 0 ${sizes(10)} 0;

  @media screen and (min-width: ${breakpoints.medium}) {
    height: 50vh;
    grid-template-columns: 1fr 1fr;
    margin: ${sizes(20)} auto 0;
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
  margin-top: ${sizes(8)};
  margin-bottom: ${sizes(8)};
  @media screen and (min-width: ${breakpoints.medium}) {
    margin-top: ${sizes(12)};
  }
`

// for tabs
export const EmptyVideos = () => {
  return (
    <Container>
      <WellIllustration />
      <Message>
        <Text variant="h5">No videos found...</Text>
        {/* <Subtitle variant="body2">No videos found..</Subtitle> */}
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
