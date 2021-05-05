import React from 'react'
import styled from '@emotion/styled'
import { ReactComponent as WellIllustration } from '@/assets/well-blue.svg'
import { ReactComponent as EmptyIllustration } from '@/assets/empty-videos-illustration.svg'
import { Button, Text } from '@/shared/components'
import { sizes, colors, media } from '@/shared/theme'
import { SvgGlyphAddVideo } from '@/shared/icons'
import { absoluteRoutes } from '@/config/routes'

// for when there is absolutely no videos available
export const EmptyVideosView: React.FC = () => {
  return (
    <ContainerView>
      <InnerContainerView>
        <MessageView>
          <Text variant="h3">Add your first video</Text>
          <Subtitle variant="body2">
            No videos uploaded yet. Start publishing by adding your first video to Joystream.
          </Subtitle>
        </MessageView>
        <div>
          <Button icon={<SvgGlyphAddVideo />} to={absoluteRoutes.studio.editVideo()}>
            Upload video
          </Button>
        </div>
      </InnerContainerView>
      <StyledWEmptyIllustration />
    </ContainerView>
  )
}

const StyledWEmptyIllustration = styled(EmptyIllustration)`
  margin: 0 auto;
  grid-row-start: 1;

  max-height: 50vh;
  max-width: 75vw;

  ${media.medium} {
    max-width: initial;
    grid-row-start: initial;
    max-height: 60vh;
  }

  ${media.xlarge} {
    max-height: 70vh;
  }

  ${media.xxlarge} {
    transform: scale(1.2);
  }
`

const ContainerView = styled.div`
  display: grid;
  padding: 0 0 ${sizes(10)} 0;

  ${media.medium} {
    grid-template-columns: auto 1fr;
    margin: ${sizes(20)} auto 0;
  }
`

const InnerContainerView = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  ${media.medium} {
    align-items: initial;
  }
`

const MessageView = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: ${sizes(8)};
  margin-bottom: ${sizes(8)};
  max-width: 450px;

  ${media.medium} {
    text-align: left;
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
      </Message>
      <Button icon={<SvgGlyphAddVideo />} to={absoluteRoutes.studio.editVideo()} size="large">
        Upload video
      </Button>
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
