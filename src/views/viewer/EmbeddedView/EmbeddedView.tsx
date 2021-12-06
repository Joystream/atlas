import { Global, SerializedStyles, css } from '@emotion/react'
import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import { useAddVideoView, useVideo } from '@/api/hooks'
import { EmptyFallback } from '@/components/EmptyFallback'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { Button } from '@/components/_buttons/Button'
import { VideoPlayer } from '@/components/_video/VideoPlayer'
import { absoluteRoutes } from '@/config/routes'
import { useRouterQuery } from '@/hooks/useRouterQuery'
import { AssetType, useAsset } from '@/providers/assets'
import { SentryLogger } from '@/utils/logs'

import { NotFoundVideoContainer, PlayerSkeletonLoader } from '../VideoView/VideoView.styles'

export const EmbeddedView: React.FC = () => {
  const { id } = useParams()
  const { loading, video, error } = useVideo(id ?? '', {
    onError: (error) => SentryLogger.error('Failed to load video data', 'VideoView', error),
  })
  const { addVideoView } = useAddVideoView()

  const timestampFromQuery = Number(useRouterQuery('time'))

  const { url: mediaUrl, isLoadingAsset: isMediaLoading } = useAsset({ entity: video, assetType: AssetType.MEDIA })

  const [startTimestamp, setStartTimestamp] = useState<number>()
  useEffect(() => {
    const duration = video?.duration ?? 0
    if (!timestampFromQuery || timestampFromQuery > duration) {
      return
    }
    setStartTimestamp(timestampFromQuery)
  }, [video?.duration, timestampFromQuery])

  const channelId = video?.channel.id
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
        {!isMediaLoading && video ? (
          <VideoPlayer
            isVideoPending={video?.mediaAvailability === 'PENDING'}
            channelId={video.channel.id}
            videoId={video.id}
            autoplay
            src={mediaUrl}
            fill
            startTime={startTimestamp}
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
export const EmbeddedGlobalStyles: React.FC<GlobalStyleProps> = ({ additionalStyles }) => {
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
