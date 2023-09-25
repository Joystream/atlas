import styled from '@emotion/styled'

import { useFullVideo } from '@/api/hooks/video'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { VideoPlayer } from '@/components/_video/VideoPlayer'
import { StyledLimitedWidthContainerVideo } from '@/views/global/YppLandingView/YppLandingView.styles'

export const YppSignupVideo = () => {
  const { video, loading } = useFullVideo('2')
  return (
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
        <Text variant="h800" as="h1">
          Sign up in 30 seconds
        </Text>
        <Text variant="t300" as="p" color="colorText">
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
