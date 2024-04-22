import styled from '@emotion/styled'

import { useFullVideo } from '@/api/hooks/video'
import { SvgEmptyStateIllustration } from '@/assets/illustrations'
import { FlexBox } from '@/components/FlexBox'
import { MarkdownPreview } from '@/components/MarkdownPreview'
import { Text } from '@/components/Text'
import { Benefit } from '@/components/_inputs/BenefitInput'
import { VideoPlayer } from '@/components/_video/VideoPlayer'
import { cVar, sizes } from '@/styles'
import { SentryLogger } from '@/utils/logs'
import { PlayerSkeletonLoader } from '@/views/viewer/VideoView/VideoView.styles'

type TokenDetailsProps = {
  videoId?: string
  benefits?: Benefit[]
  about?: string
}

export const TokenDetails = ({ about, videoId, benefits }: TokenDetailsProps) => {
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
  const isEmpty = !loading && !video && !benefits?.length && !about

  if (isEmpty) {
    return (
      <EmptyBox flow="column" alignItems="center">
        <SvgEmptyStateIllustration />
        <Text variant="h500" as="h1" margin={{ top: 10 }}>
          Token description pending
        </Text>
        <Text variant="t200" as="p" color="colorText">
          The creator is yet to provide the overview of their token. Watch this space and check later again.
        </Text>
      </EmptyBox>
    )
  }

  return (
    <FlexBox gap={12} flow="column">
      {!loading ? (
        video ? (
          <VideoBox>
            <VideoPlayer
              videoId={videoId}
              hideEndOverlay
              isMinimized={false}
              videoUrls={video?.media?.resolvedUrls}
              posterUrls={video?.thumbnailPhoto?.resolvedUrls}
            />
          </VideoBox>
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
              {/*<EmojiPlaceholder />*/}
              <FlexBox flow="column">
                <Text variant="h400" as="h4">
                  {benefit.title || 'Benefit title'}
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

const EmptyBox = styled(FlexBox)`
  background-color: ${cVar('colorBackgroundMutedAlpha')};
  padding: ${sizes(14)} ${sizes(14)};
  text-align: center;
`
