import { Global, SerializedStyles, css } from '@emotion/react'
import styled from '@emotion/styled'
import { throttle } from 'lodash-es'
import { FC, useCallback, useRef } from 'react'
import { useParams } from 'react-router'

import { useAddVideoView, useFullVideo } from '@/api/hooks/video'
import { EmptyFallback } from '@/components/EmptyFallback'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { Button } from '@/components/_buttons/Button'
import { VideoPlayer } from '@/components/_video/VideoPlayer'
import { absoluteRoutes } from '@/config/routes'
import { useVideoStartTimestamp } from '@/hooks/useVideoStartTimestamp'
import { SentryLogger } from '@/utils/logs'

import { NotFoundVideoContainer, PlayerSkeletonLoader } from '../VideoView/VideoView.styles'

export const EmbeddedView: FC = () => {
  const { id } = useParams()
  const { loading, video, error } = useFullVideo(id ?? '', {
    onError: (error) => SentryLogger.error('Failed to load video data', 'VideoView', error),
  })
  const { addVideoView } = useAddVideoView()

  const mediaUrls = video?.media?.resolvedUrls
  const thumbnailUrls = video?.thumbnailPhoto?.resolvedUrls
  const channelAvatarUrls = video?.channel.avatarPhoto?.resolvedUrls

  const startTimestamp = useVideoStartTimestamp(video?.duration)

  const channelId = video?.channel?.id
  const videoId = video?.id

  const handleAddVideoView = useCallback(() => {
    if (!videoId || !channelId) {
      return
    }
    addVideoView({
      variables: {
        videoId,
      },
    }).catch((error) => {
      SentryLogger.error('Failed to increase video views', 'VideoView', error)
    })
  }, [addVideoView, channelId, videoId])

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
        {!loading && video ? (
          <VideoPlayer
            onAddVideoView={handleAddVideoView}
            isVideoPending={!video?.media?.isAccepted}
            channelAvatarUrls={channelAvatarUrls}
            isChannelAvatarLoading={loading}
            videoId={video.id}
            videoUrls={mediaUrls}
            posterUrls={thumbnailUrls}
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
