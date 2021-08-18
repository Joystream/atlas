import { throttle } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useAddVideoView, useVideo } from '@/api/hooks'
import { ChannelLink, InfiniteVideoGrid } from '@/components'
import { absoluteRoutes } from '@/config/routes'
import knownLicenses from '@/data/knownLicenses.json'
import { useRouterQuery } from '@/hooks'
import { AssetType, useAsset, usePersonalDataStore } from '@/providers'
import { Button, EmptyFallback, SkeletonLoader, VideoPlayer } from '@/shared/components'
import { transitions } from '@/shared/theme'
import { Logger } from '@/utils/logger'
import { formatVideoViewsAndDate } from '@/utils/video'

import {
  ChannelContainer,
  DescriptionContainer,
  DescriptionSkeletonLoader,
  InfoContainer,
  LicenseContainer,
  Meta,
  MoreVideosContainer,
  MoreVideosHeader,
  NotFoundVideoContainer,
  PlayerContainer,
  PlayerSkeletonLoader,
  PlayerWrapper,
  StyledViewWrapper,
  TitleText,
} from './VideoView.style'

export const VideoView: React.FC = () => {
  const { id } = useParams()
  const { loading, video, error } = useVideo(id)
  const { addVideoView } = useAddVideoView()
  const watchedVideos = usePersonalDataStore((state) => state.watchedVideos)
  const updateWatchedVideos = usePersonalDataStore((state) => state.actions.updateWatchedVideos)

  const timestampFromQuery = Number(useRouterQuery('time'))

  const { url: thumbnailPhotoUrl } = useAsset({
    entity: video,
    assetType: AssetType.THUMBNAIL,
  })
  const { url: mediaUrl } = useAsset({ entity: video, assetType: AssetType.MEDIA })

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

  if (error) {
    throw error
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

  const foundLicense = knownLicenses.find((license) => license.code === video?.license?.code)

  return (
    <StyledViewWrapper>
      <PlayerWrapper>
        <PlayerContainer>
          {video ? (
            <VideoPlayer
              channelId={video.channel.id}
              videoId={video.id}
              autoplay
              src={mediaUrl}
              fill
              posterUrl={thumbnailPhotoUrl}
              onEnd={handleVideoEnd}
              onTimeUpdated={handleTimeUpdate}
              startTime={startTimestamp}
            />
          ) : (
            <PlayerSkeletonLoader />
          )}
        </PlayerContainer>
      </PlayerWrapper>
      <InfoContainer className={transitions.names.slide}>
        {video ? <TitleText variant="h2">{video.title}</TitleText> : <SkeletonLoader height={46} width={400} />}
        <Meta variant="subtitle1">
          {video ? (
            formatVideoViewsAndDate(video.views || null, video.createdAt, { fullViews: true })
          ) : (
            <SkeletonLoader height={18} width={200} />
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
              <DescriptionSkeletonLoader width={700} />
              <DescriptionSkeletonLoader width={400} />
              <DescriptionSkeletonLoader width={800} />
              <DescriptionSkeletonLoader width={300} />
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
            <SkeletonLoader height={12} width={200} />
          )}
        </LicenseContainer>
        <MoreVideosContainer>
          <MoreVideosHeader>
            {video ? `More from ${video.channel.title}` : <SkeletonLoader height={23} width={300} />}
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
