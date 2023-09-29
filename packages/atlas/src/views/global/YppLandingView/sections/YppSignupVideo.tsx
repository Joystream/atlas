import styled from '@emotion/styled'

import { useFullVideo } from '@/api/hooks/video'
import { GridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { VideoPlayer } from '@/components/_video/VideoPlayer'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import {
  BackgroundContainer,
  CenteredLayoutGrid,
  StyledLimitedWidthContainerVideo,
} from '@/views/global/YppLandingView/YppLandingView.styles'
import { useSectionTextVariants } from '@/views/global/YppLandingView/sections/useSectionTextVariants'

export const YppSignupVideo = () => {
  const { video, loading } = useFullVideo('2')
  const mdMatch = useMediaMatch('md')
  const [titleVariant, subtitleVariant] = useSectionTextVariants()

  return (
    <BackgroundContainer noBackground>
      <StyledLimitedWidthContainerVideo>
        <CenteredLayoutGrid data-aos="fade-up" data-aos-delay="0" data-aos-offset="80" data-aos-easing="atlas-easing">
          <GridItem colSpan={{ base: 12, sm: 10, md: 8, lg: 6 }} colStart={{ sm: 2, md: 3, lg: 4 }}>
            <Text variant={titleVariant} as="h1">
              Sign up in 30 seconds
            </Text>
            <Text
              variant={subtitleVariant}
              as="p"
              color="colorText"
              align="center"
              margin={{ top: 4, bottom: mdMatch ? 16 : 12 }}
            >
              Watch the sign up demo by one of Joystream members.
            </Text>
          </GridItem>
          <GridItem colSpan={{ base: 12, sm: 10, md: 8, lg: 6 }} colStart={{ sm: 2, md: 3, lg: 4 }}>
            {loading && !video ? (
              <PlayerSkeletonLoader
                data-aos="fade-up"
                data-aos-delay="100"
                data-aos-offset="40"
                data-aos-easing="atlas-easing"
              />
            ) : (
              <PlayerContainer
                data-aos="fade-up"
                data-aos-delay="100"
                data-aos-offset="40"
                data-aos-easing="atlas-easing"
              >
                <VideoPlayer videoId={video?.id} videoUrls={video?.media?.resolvedUrls} hideCinematic />
              </PlayerContainer>
            )}
          </GridItem>
        </CenteredLayoutGrid>
      </StyledLimitedWidthContainerVideo>
    </BackgroundContainer>
  )
}

const PlayerContainer = styled.div`
  width: 100%;
  position: relative;
  aspect-ratio: 16/9;
`

export const PlayerSkeletonLoader = styled(SkeletonLoader)`
  position: absolute;
  top: 0;
`
