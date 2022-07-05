import { Global, SerializedStyles, css } from '@emotion/react'
import styled from '@emotion/styled'
import { throttle } from 'lodash-es'
import { FC, useEffect, useRef } from 'react'
import { useParams } from 'react-router'

import { useAddVideoView, useFullVideo } from '@/api/hooks'
import { EmptyFallback } from '@/components/EmptyFallback'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { Button } from '@/components/_buttons/Button'
import { VideoPlayer } from '@/components/_video/VideoPlayer'
import { absoluteRoutes } from '@/config/routes'
import { useRedirectMigratedContent } from '@/hooks/useRedirectMigratedContent'
import { useVideoStartTimestamp } from '@/hooks/useVideoStartTimestamp'
import { useAsset } from '@/providers/assets'
import { SentryLogger } from '@/utils/logs'

import { NotFoundVideoContainer, PlayerSkeletonLoader } from '../VideoView/VideoView.styles'

export const EmbeddedView: FC = () => {
  useRedirectMigratedContent({ type: 'embedded-video' })
  const { id } = useParams()
  const { loading, video, error } = useFullVideo(id ?? '', {
    onError: (error) => SentryLogger.error('Failed to load video data', 'VideoView', error),
  })
  const { addVideoView } = useAddVideoView()

  const { url: mediaUrl, isLoadingAsset: isMediaLoading } = useAsset(video?.media)
  const { url: thumbnailUrl, isLoadingAsset: isThumbnailLoading } = useAsset(video?.thumbnailPhoto)
  const { url: channelAvatarUrl, isLoadingAsset: isChannelAvatarLoading } = useAsset(video?.channel.avatarPhoto)

  const { startTimestamp } = useVideoStartTimestamp(video?.duration)

  const channelId = video?.channel?.id
  const videoId = video?.id
  const categoryId = video?.category?.id

  useEffect(() => {
    if (!videoId || !channelId) {
      return
    }
    addVideoView({
      variables: {
        videoId,
        channelId,
        categoryId,
      },
    }).catch((error) => {
      SentryLogger.error('Failed to increase video views', 'VideoView', error)
    })
  }, [addVideoView, videoId, channelId, categoryId])

  const handleVideoEnded = () => {
    if (window.top) {
      window.top.postMessage('atlas_video_ended', '*')
    }
  }

  const throttledSendTimeUpdate = useRef(
    throttle((time: number) => {
      if (window.top) {
        window.top.postMessage(`atlas_video_progress:${time}`, '*')
      }
    }, 1000)
  )

  const handleTimeUpdated = (time: number) => {
    if (!video?.duration) {
      return
    }

    const progress = time / video.duration
    // make sure progress is in 0..1 range
    const normalizedProgress = Math.min(Math.max(0, progress), 1)
    throttledSendTimeUpdate.current(normalizedProgress)
  }

  if (error) {
    return <ViewErrorFallback />
  }

  if (!loading && !video) {
    return (
      <NotFoundVideoContainer>
        <EmptyFallback
          title="Video not found"
          button={
            <Button variant="secondary" size="large" to={absoluteRoutes.viewer.index()}>
              Go back to home page
            </Button>
          }
        />
      </NotFoundVideoContainer>
    )
  }

  return (
    <>
      <EmbeddedGlobalStyles />
      <Container>
        {!isMediaLoading && !isThumbnailLoading && video ? (
          <VideoPlayer
            isVideoPending={!video?.media?.isAccepted}
            channelId={video.channel?.id}
            channelAvatarUrl={channelAvatarUrl}
            isChannelAvatarLoading={isChannelAvatarLoading}
            title={video.title}
            channelTitle={video.channel.title}
            videoId={video.id}
            src={mediaUrl}
            posterUrl={thumbnailUrl}
            fill
            startTime={startTimestamp}
            onEnd={handleVideoEnded}
            onTimeUpdated={handleTimeUpdated}
            isEmbedded
          />
        ) : (
          <PlayerSkeletonLoader />
        )}
      </Container>
    </>
  )
}

type GlobalStyleProps = {
  additionalStyles?: SerializedStyles[] | SerializedStyles
}
export const EmbeddedGlobalStyles: FC<GlobalStyleProps> = ({ additionalStyles }) => {
  const additionalStylesArray = additionalStyles
    ? Array.isArray(additionalStyles)
      ? additionalStyles
      : [additionalStyles]
    : []
  return <Global styles={[globalStyles, ...additionalStylesArray]} />
}

const Container = styled.div`
  overflow: hidden;
  height: 100%;
`

export const globalStyles = css`
  body {
    overflow: hidden;
  }
`
