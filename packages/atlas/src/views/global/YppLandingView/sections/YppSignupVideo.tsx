import styled from '@emotion/styled'

import { GridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import {
  BackgroundContainer,
  CenteredLayoutGrid,
  StyledLimitedWidthContainerVideo,
} from '@/views/global/YppLandingView/YppLandingView.styles'
import { useSectionTextVariants } from '@/views/global/YppLandingView/sections/useSectionTextVariants'

export const YppSignupVideo = () => {
  const mdMatch = useMediaMatch('md')
  const [titleVariant, subtitleVariant] = useSectionTextVariants()

  return (
    <BackgroundContainer noBackground>
      <StyledLimitedWidthContainerVideo noBottomPadding>
        <CenteredLayoutGrid data-aos="fade-up" data-aos-delay="0" data-aos-offset="80" data-aos-easing="atlas-easing">
          <GridItem colSpan={{ base: 12, sm: 10, md: 8, lg: 6 }} colStart={{ sm: 2, md: 3, lg: 4 }}>
            <Text variant={titleVariant} as="h1">
              Sync your channel from YouTube in 60 seconds
            </Text>
            <Text
              variant={subtitleVariant}
              as="p"
              color="colorText"
              align="center"
              margin={{ top: 4, bottom: mdMatch ? 16 : 12 }}
            >
              And get paid in JOY tokens for sign up and new videos synced.
            </Text>
          </GridItem>
          <GridItem colSpan={{ base: 12, sm: 10, md: 8, lg: 6 }} colStart={{ sm: 2, md: 3, lg: 4 }}>
            <PlayerContainer
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-offset="40"
              data-aos-easing="atlas-easing"
            >
              <IframeVideo
                src="https://player.vimeo.com/video/875953807?badge=0&amp;autopause=0&amp;quality_selector=1&amp;progress_bar=1&amp;player_id=0&amp;app_id=58479"
                allow="autoplay; fullscreen; picture-in-picture"
                title="YPP"
              />
            </PlayerContainer>
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

const IframeVideo = styled.iframe`
  border: none;
  width: 640px;
  height: 364px;
  max-width: 100%;
  max-height: 55vw;
`
