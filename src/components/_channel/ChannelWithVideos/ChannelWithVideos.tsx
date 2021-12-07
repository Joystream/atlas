import React, { FC, useMemo, useState } from 'react'

import { useChannel, useChannelPreviewVideos } from '@/api/hooks'
import { Grid } from '@/components/Grid'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { VideoTile } from '@/components/_video/VideoTile'
import { absoluteRoutes } from '@/config/routes'
import { useHandleFollowChannel } from '@/hooks/useHandleFollowChannel'
import { useVideoGridRows } from '@/hooks/useVideoGridRows'
import { AssetType, useAsset } from '@/providers/assets'
import { SentryLogger } from '@/utils/logs'
import { formatNumberShort } from '@/utils/number'

import {
  ChannelCardAnchor,
  ChannelFollows,
  ChannelTitle,
  FollowButton,
  InfoWrapper,
  StyledAvatar,
} from './ChannelWithVideos.styles'

type ChannelWithVideosProps = {
  channelId?: string
}

const INITIAL_VIDEOS_PER_ROW = 4

export const ChannelWithVideos: FC<ChannelWithVideosProps> = React.memo(({ channelId }) => {
  const videoRows = useVideoGridRows('compact')
  const [videosPerRow, setVideosPerRow] = useState(INITIAL_VIDEOS_PER_ROW)
  const {
    channel,
    loading: channelLoading,
    error: channelError,
  } = useChannel(channelId || '', {
    skip: !channelId,
    onError: (error) => SentryLogger.error('Failed to fetch channel', 'ChannelWithVideos', error),
  })
  const {
    videos,
    loading: videosLoading,
    error: videosError,
  } = useChannelPreviewVideos(channelId, {
    onError: (error) => SentryLogger.error('Failed to fetch videos', 'ChannelWithVideos', error),
  })

  const { url: avatarUrl, isLoadingAsset: isLoadingAvatar } = useAsset({ entity: channel, assetType: AssetType.AVATAR })
  const { toggleFollowing, isFollowing } = useHandleFollowChannel(channelId, channel?.title)

  const targetItemsCount = videosPerRow * videoRows
  const displayedVideos = (videos || []).slice(0, targetItemsCount)
  const placeholderItems = useMemo(
    () => (videosLoading ? Array.from({ length: targetItemsCount }, () => ({ id: undefined })) : []),
    [targetItemsCount, videosLoading]
  )

  const gridContent = useMemo(
    () =>
      [...displayedVideos, ...placeholderItems].map((video, idx) => (
        <VideoTile id={video.id} key={`channels-with-videos-${idx}`} showChannel />
      )),
    [displayedVideos, placeholderItems]
  )

  const handleFollowClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    toggleFollowing()
  }

  const isLoading = !channelId || channelLoading

  if (channelError || videosError) {
    return null
  }

  return (
    <>
      <ChannelCardAnchor to={channelId ? absoluteRoutes.viewer.channel(channelId) : ''}>
        <StyledAvatar size="channel" loading={isLoading || isLoadingAvatar} assetUrl={avatarUrl} />
        <InfoWrapper>
          {isLoading ? (
            <SkeletonLoader width="120px" height="20px" bottomSpace="4px" />
          ) : (
            <ChannelTitle variant="h300">{channel?.title}</ChannelTitle>
          )}
          {isLoading ? (
            <SkeletonLoader width="80px" height="20px" bottomSpace="8px" />
          ) : (
            <ChannelFollows variant="t200" secondary>
              {formatNumberShort(channel?.follows || 0)} followers
            </ChannelFollows>
          )}
          {isLoading ? (
            <SkeletonLoader width="90px" height="40px" />
          ) : (
            <FollowButton variant="secondary" size="medium" onClick={handleFollowClick}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </FollowButton>
          )}
        </InfoWrapper>
      </ChannelCardAnchor>
      <Grid onResize={(sizes) => setVideosPerRow(sizes.length)}>{gridContent}</Grid>
    </>
  )
})

ChannelWithVideos.displayName = 'ChannelWithVideos'
