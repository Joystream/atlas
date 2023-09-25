import styled from '@emotion/styled'

import { useFullVideo } from '@/api/hooks/video'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { VideoPlayer } from '@/components/_video/VideoPlayer'
import {
  BackgroundContainer,
  StyledLimitedWidthContainerVideo,
} from '@/views/global/YppLandingView/YppLandingView.styles'
import { useSectionTextVariants } from '@/views/global/YppLandingView/sections/useSectionTextVariants'

export const YppSignupVideo = () => {
  const { video, loading } = useFullVideo('2')
  const [titleVariant, subtitleVariant] = useSectionTextVariants()

  return (
    <BackgroundContainer noBackground>
      <StyledLimitedWidthContainerVideo>
        <FlexBox
          flow="column"
          alignItems="center"
          gap={4}
          data-aos="fade-up"
          data-aos-delay="0"
          data-aos-offset="80"
          data-aos-easing="atlas-easing"
        >
          <Text variant={titleVariant} as="h1">
            Sign up in 30 seconds
          </Text>
          <Text variant={subtitleVariant} as="p" color="colorText" align="center">
            Watch the sign up demo by one of Joystream members.
          </Text>
        </FlexBox>
        {loading && !video ? (
          <PlayerSkeletonLoader
            data-aos="fade-up"
            data-aos-delay="100"
            data-aos-offset="40"
            data-aos-easing="atlas-easing"
          />
        ) : (
          <PlayerContainer data-aos="fade-up" data-aos-delay="100" data-aos-offset="40" data-aos-easing="atlas-easing">
            <VideoPlayer videoId={video?.id} videoUrls={video?.media?.resolvedUrls} hideCinematic />
          </PlayerContainer>
        )}
      </StyledLimitedWidthContainerVideo>
    </BackgroundContainer>
  )
}

const PlayerContainer = styled.div`
  width: 100%;
  position: relative;
  aspect-ratio: 16/9;
  max-width: 640px;
`

export const PlayerSkeletonLoader = styled(SkeletonLoader)`
  position: absolute;
  top: 0;
`
