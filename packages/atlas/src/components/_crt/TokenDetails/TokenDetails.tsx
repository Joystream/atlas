import styled from '@emotion/styled'

import { useFullVideo } from '@/api/hooks/video'
import { FlexBox } from '@/components/FlexBox'
import { MarkdownPreview } from '@/components/MarkdownPreview'
import { Text } from '@/components/Text'
import { Benefit } from '@/components/_inputs/BenefitInput'
import { EmojiPlaceholder } from '@/components/_inputs/BenefitInput/BenefitInput.styles'
import { VideoPlayer } from '@/components/_video/VideoPlayer'
import { SentryLogger } from '@/utils/logs'
import { PlayerSkeletonLoader } from '@/views/viewer/VideoView/VideoView.styles'

type TokenDetailsProps = {
  videoId?: string
  benefits?: Benefit[]
  about?: string
  displayEmptyVideoPlaceholder?: boolean
}

export const TokenDetails = ({ about, videoId, benefits, displayEmptyVideoPlaceholder = true }: TokenDetailsProps) => {
  const { loading, video } = useFullVideo(
    videoId ?? '',
    {
      skip: !videoId,
      onError: (error) => SentryLogger.error('Failed to load video data', 'TokenDetails', error),
    },
    // cancel video filters - if video is accessed directly with a link allowed it to be unlisted, and have un-uploaded assets
    {
      where: {
        isPublic_eq: undefined,
        thumbnailPhoto: {
          isAccepted_eq: undefined,
        },
        media: {
          isAccepted_eq: undefined,
        },
      },
    }
  )
  return (
    <FlexBox gap={12} flow="column">
      {!loading ? (
        video ? (
          <VideoBox>
            <VideoPlayer videoId={videoId} hideEndOverlay isMinimized={false} videoUrls={video?.media?.resolvedUrls} />
          </VideoBox>
        ) : displayEmptyVideoPlaceholder ? (
          <div>no video</div>
        ) : null
      ) : (
        <VideoBox>
          <PlayerSkeletonLoader />
        </VideoBox>
      )}
      {benefits?.length ? (
        <FlexBox gap={6} flow="column">
          <Text variant="h500" as="h5">
            Benefits
          </Text>
          {benefits.map((benefit, idx) => (
            <FlexBox key={idx} gap={4}>
              <EmojiPlaceholder />
              <FlexBox flow="column">
                <Text variant="h400" as="h4">
                  {benefit.title}
                </Text>
                <Text variant="t300" as="p" color="colorTextMuted">
                  {benefit.description}
                </Text>
              </FlexBox>
            </FlexBox>
          ))}
        </FlexBox>
      ) : null}
      {about && (
        <FlexBox gap={6} flow="column">
          <Text variant="h500" as="h5">
            About
          </Text>
          <MarkdownPreview markdown={about} />
        </FlexBox>
      )}
    </FlexBox>
  )
}

const VideoBox = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
`
