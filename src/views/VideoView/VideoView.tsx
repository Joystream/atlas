import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { throttle } from 'lodash'
import {
  ChannelContainer,
  Container,
  DescriptionContainer,
  DescriptionPlaceholder,
  InfoContainer,
  Meta,
  MoreVideosContainer,
  MoreVideosHeader,
  PlayerContainer,
  PlayerPlaceholder,
  PlayerWrapper,
  LicenseContainer,
} from './VideoView.style'
import { Placeholder, VideoPlayer, Text } from '@/shared/components'
import { useMutation, useQuery } from '@apollo/client'
import { ADD_VIDEO_VIEW, GET_VIDEO } from '@/api/queries'
import { GetVideo, GetVideoVariables } from '@/api/queries/__generated__/GetVideo'
import { formatVideoViewsAndDate } from '@/utils/video'
import { AddVideoView, AddVideoViewVariables } from '@/api/queries/__generated__/AddVideoView'

import { ChannelLink, InfiniteVideoGrid } from '@/components'
import { usePersonalData, useRouterQuery } from '@/hooks'

const VideoView: React.FC = () => {
  const { id } = useParams()
  const { loading, data, error } = useQuery<GetVideo, GetVideoVariables>(GET_VIDEO, {
    variables: { id },
  })
  const [addVideoView] = useMutation<AddVideoView, AddVideoViewVariables>(ADD_VIDEO_VIEW)
  const { state, updateWatchedVideos } = usePersonalData()
  const timestampFromQuery = Number(useRouterQuery('time'))

  const [startTimestamp, setStartTimestamp] = useState<number>()
  useEffect(() => {
    if (startTimestamp != null) {
      return
    }
    const currentVideo = state.watchedVideos.find((v) => v.id === id)

    setStartTimestamp(currentVideo?.__typename === 'INTERRUPTED' ? currentVideo.timestamp : 0)
  }, [id, state.watchedVideos, startTimestamp, data?.video?.duration])

  useEffect(() => {
    const duration = data?.video?.duration ?? 0
    if (!timestampFromQuery || timestampFromQuery > duration) {
      return
    }
    setStartTimestamp(timestampFromQuery)
  }, [data?.video?.duration, timestampFromQuery])

  const channelId = data?.video?.channel.id
  const videoId = data?.video?.id

  const [playing, setPlaying] = useState(true)
  const handleUserKeyPress = useCallback((event: Event) => {
    const { keyCode } = event as KeyboardEvent
    if (keyCode === 32) {
      event.preventDefault()
      setPlaying((prevState) => !prevState)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleUserKeyPress)

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress)
    }
  }, [handleUserKeyPress])

  useEffect(() => {
    if (!videoId || !channelId) {
      return
    }
    addVideoView({
      variables: { videoId, channelId },
      update: (cache, mutationResult) => {
        cache.modify({
          id: cache.identify({
            __typename: 'Video',
            id: videoId,
          }),
          fields: {
            views: () => mutationResult.data?.addVideoView.views,
          },
        })
      },
    }).catch((error) => {
      console.warn('Failed to increase video views', { error })
    })
  }, [addVideoView, videoId, channelId])

  // Save the video timestamp
  // disabling eslint for this line since debounce is an external fn and eslint can't figure out its args, so it will complain.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleTimeUpdate = useCallback(
    throttle((time) => {
      if (data?.video?.id) {
        updateWatchedVideos('INTERRUPTED', data.video.id, time)
      }
    }, 5000),
    [data?.video?.id]
  )

  const handleVideoEnd = useCallback(() => {
    if (data?.video?.id) {
      handleTimeUpdate.cancel()
      updateWatchedVideos('COMPLETED', data?.video?.id)
    }
  }, [data?.video?.id, handleTimeUpdate, updateWatchedVideos])

  const handlePlay = useCallback(() => {
    setPlaying(true)
  }, [])
  const handlePause = useCallback(() => {
    setPlaying(false)
  }, [])

  if (error) {
    throw error
  }

  if (!loading && !data?.video) {
    return <p>Video not found</p>
  }

  return (
    <Container>
      <PlayerWrapper>
        <PlayerContainer>
          {data?.video ? (
            <VideoPlayer
              playing={playing}
              src={data.video.media.location}
              fluid
              posterUrl={data.video.thumbnailUrl}
              onEnd={handleVideoEnd}
              onTimeUpdated={handleTimeUpdate}
              onPlay={handlePlay}
              onPause={handlePause}
              startTime={startTimestamp}
            />
          ) : (
            <PlayerPlaceholder />
          )}
        </PlayerContainer>
      </PlayerWrapper>
      <InfoContainer>
        {data?.video ? <Text variant="h2">{data.video.title}</Text> : <Placeholder height={46} width={400} />}
        <Meta>
          {data?.video ? (
            formatVideoViewsAndDate(data.video.views, data.video.createdAt, { fullViews: true })
          ) : (
            <Placeholder height={18} width={200} />
          )}
        </Meta>
        <ChannelContainer>
          <ChannelLink id={data?.video?.channel.id} />
        </ChannelContainer>
        <DescriptionContainer>
          {data?.video ? (
            <>
              {data.video.description.split('\n').map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </>
          ) : (
            <>
              <DescriptionPlaceholder width={700} />
              <DescriptionPlaceholder width={400} />
              <DescriptionPlaceholder width={800} />
              <DescriptionPlaceholder width={300} />
            </>
          )}
        </DescriptionContainer>
        <LicenseContainer>
          {data?.video ? (
            <>
              <p>
                License:{' '}
                {data.video.license.type.__typename === 'KnownLicense' ? (
                  <a href={data.video.license.type.url || ''} target="_blank" rel="noopener noreferrer">
                    {data.video.license.type.code}
                  </a>
                ) : (
                  data.video.license.type.content
                )}
              </p>
              {data.video.license?.attribution ? <p>Attribution: {data.video.license.attribution}</p> : null}
            </>
          ) : (
            <Placeholder height={12} width={200} />
          )}
        </LicenseContainer>
        <MoreVideosContainer>
          <MoreVideosHeader>
            {data?.video ? `More from ${data.video.channel.handle}` : <Placeholder height={23} width={300} />}
          </MoreVideosHeader>
          <InfiniteVideoGrid ready={!loading} channelId={data?.video?.channel.id} showChannel={false} />
        </MoreVideosContainer>
      </InfoContainer>
    </Container>
  )
}

export default VideoView
