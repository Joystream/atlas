import styled from '@emotion/styled'
import { FC } from 'react'

import { AnimatedError } from '@/components/AnimatedError'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { cVar, media, sizes } from '@/styles'

type VideoUnavailableErrorProps = {
  isCinematic: boolean
}

export const VideoUnavailableError: FC<VideoUnavailableErrorProps> = ({ isCinematic }) => {
  const mdMatch = useMediaMatch('md')
  return (
    <Container isCinematic={isCinematic}>
      <InnerWrapper>
        <StyledAnimatedError />
        <Text variant={mdMatch ? 'h600' : 'h400'} as="h1" margin={{ top: mdMatch ? 8 : 6 }}>
          Video unavailable
        </Text>
        <Text
          variant={mdMatch ? 't300' : 't200'}
          as="p"
          margin={{ top: 2, bottom: mdMatch ? 8 : 6 }}
          color="colorCoreNeutral300"
        >
          This video was deleted by creator, moderated by the content curation team or not included by the application
          operator.
        </Text>
        <Button to={absoluteRoutes.viewer.index()} size={mdMatch ? 'medium' : 'small'}>
          Return to homepage
        </Button>
      </InnerWrapper>
    </Container>
  )
}

const StyledAnimatedError = styled(AnimatedError)`
  width: 108px;
  margin-top: -${sizes(11)} !important;

  ${media.md} {
    width: 216px;
    margin-top: -${sizes(22)} !important;
  }
`

const Container = styled.div<{ isCinematic: boolean }>`
  background-color: ${cVar('colorCoreNeutral900')};
  padding: 0 ${sizes(6)};
  height: 55.7vw;
  display: flex;
  align-items: center;
  overflow: hidden;

  ${media.md} {
    padding: 0 ${sizes(3)};
    height: ${({ isCinematic }) => (isCinematic ? '52.6vw' : '33.3vw')};
  }

  ${media.lg} {
    padding: 0 ${sizes(3)};
  }
`

const InnerWrapper = styled.div`
  display: grid;
  place-items: center;
  text-align: center;
  margin: 0 auto;

  ${media.md} {
    max-width: 560px;
  }
`
