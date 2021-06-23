import { throttle } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import { useMatch, useParams } from 'react-router-dom'

import { useAddVideoView, useVideo } from '@/api/hooks'
import { ChannelLink, InfiniteVideoGrid } from '@/components'
import { absoluteRoutes } from '@/config/routes'
import knownLicenses from '@/data/knownLicenses.json'
import { AssetType, useAsset, useRouterQuery } from '@/hooks'
import { usePersonalDataStore } from '@/providers'
import { Placeholder, VideoPlayer } from '@/shared/components'
import { transitions } from '@/shared/theme'
import { Logger } from '@/utils/logger'
import { formatVideoViewsAndDate } from '@/utils/video'

import {
  ChannelContainer,
  DescriptionContainer,
  DescriptionPlaceholder,
  InfoContainer,
  LicenseContainer,
  Meta,
  MoreVideosContainer,
  MoreVideosHeader,
  PlayerContainer,
  PlayerPlaceholder,
  PlayerWrapper,
  StyledViewWrapper,
  TitleText,
} from './VideoView.style'

export const VideoView: React.FC = () => {
  const { id } = useParams()
  const { loading, video, error } = useVideo(id)
  const { addVideoView } = useAddVideoView()
  const {
    watchedVideos,
    actions: { updateWatchedVideos },
  } = usePersonalDataStore()
  const timestampFromQuery = Number(useRouterQuery('time'))

  const { url: thumbnailPhotoUrl } = useAsset({
    entity: video,
    assetType: AssetType.THUMBNAIL,
  })
  const { url: mediaUrl } = useAsset({ entity: video, assetType: AssetType.MEDIA })

  const videoRouteMatch = useMatch({ path: absoluteRoutes.viewer.video(id) })
  const [startTimestamp, setStartTimestamp] = useState<number>()
  useEffect(() => {
    if (startTimestamp != null) {
      return
    }
    const currentVideo = watchedVideos.find((v) => v.id === video?.id)

    setStartTimestamp(currentVideo?.__typename === 'INTERRUPTED' ? currentVideo.timestamp : 0)
  }, [watchedVideos, startTimestamp, video?.duration, video?.id])

  useEffect(() => {
    const duration = video?.duration ?? 0
    if (!timestampFromQuery || timestampFromQuery > duration) {
      return
    }
    setStartTimestamp(timestampFromQuery)
  }, [video?.duration, timestampFromQuery])

  const channelId = video?.channel.id
  const videoId = video?.id

  const [playing, setPlaying] = useState(true)
  const handleUserKeyPress = useCallback(
    (event: Event) => {
      const { keyCode } = event as KeyboardEvent
      if (videoRouteMatch) {
        switch (keyCode) {
          case 32:
            event.preventDefault()
            setPlaying((prevState) => !prevState)
            break
          default:
            break
        }
      }
    },
    [videoRouteMatch]
  )

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
      variables: {
        videoId,
        channelId,
      },
    }).catch((error) => {
      Logger.warn('Failed to increase video views', { error })
    })
  }, [addVideoView, videoId, channelId])

  // Save the video timestamp
  // disabling eslint for this line since debounce is an external fn and eslint can't figure out its args, so it will complain.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleTimeUpdate = useCallback(
    throttle((time) => {
      if (video?.id) {
        updateWatchedVideos('INTERRUPTED', video.id, time)
      }
    }, 5000),
    [video?.id]
  )

  const handleVideoEnd = useCallback(() => {
    if (video?.id) {
      handleTimeUpdate.cancel()
      updateWatchedVideos('COMPLETED', video?.id)
    }
  }, [video?.id, handleTimeUpdate, updateWatchedVideos])

  const handlePlay = useCallback(() => {
    setPlaying(true)
  }, [])
  const handlePause = useCallback(() => {
    setPlaying(false)
  }, [])

  if (error) {
    throw error
  }

  if (!loading && !video) {
    return <p>Video not found</p>
  }

  const foundLicense = knownLicenses.find((license) => license.code === video?.license?.code)

  return (
    <StyledViewWrapper>
      <PlayerWrapper>
        <PlayerContainer>
          {video ? (
            <VideoPlayer
              playing={playing}
              src={mediaUrl}
              fill
              posterUrl={thumbnailPhotoUrl}
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
      <InfoContainer className={transitions.names.slide}>
        {video ? <TitleText variant="h2">{video.title}</TitleText> : <Placeholder height={46} width={400} />}
        <Meta variant="subtitle1">
          {video ? (
            formatVideoViewsAndDate(video.views || null, video.createdAt, { fullViews: true })
          ) : (
            <Placeholder height={18} width={200} />
          )}
        </Meta>
        <ChannelContainer>
          <ChannelLink id={video?.channel.id} />
        </ChannelContainer>
        <DescriptionContainer>
          {video ? (
            <>
              {video.description?.split('\n').map((line, idx) => (
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
          {video ? (
            <>
              License:
              {foundLicense && (
                <a href={foundLicense.url} target="_blank" rel="noopener noreferrer">
                  {foundLicense.name}
                </a>
              )}
              <p>{video.license?.customText}</p>
              {video.license?.attribution ? <p>Attribution: {video.license.attribution}</p> : null}
            </>
          ) : (
            <Placeholder height={12} width={200} />
          )}
        </LicenseContainer>
        <MoreVideosContainer>
          <MoreVideosHeader>
            {video ? `More from ${video.channel.title}` : <Placeholder height={23} width={300} />}
          </MoreVideosHeader>
          <InfiniteVideoGrid
            ready={!loading}
            channelId={video?.channel.id}
            showChannel={false}
            currentlyWatchedVideoId={video?.id}
          />
        </MoreVideosContainer>
      </InfoContainer>
    </StyledViewWrapper>
  )
}
