import { FC, MouseEvent, memo, useMemo, useState } from 'react'

import { useBasicChannel, useChannelPreviewVideos } from '@/api/hooks'
import { Grid } from '@/components/Grid'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'
import { absoluteRoutes } from '@/config/routes'
import { useHandleFollowChannel } from '@/hooks/useHandleFollowChannel'
import { useVideoGridRows } from '@/hooks/useVideoGridRows'
import { useAsset } from '@/providers/assets'
import { SentryLogger } from '@/utils/logs'

import { ChannelCardAnchor, ChannelFollows, FollowButton, InfoWrapper, StyledAvatar } from './ChannelWithVideos.styles'

type ChannelWithVideosProps = {
  channelId?: string
}

const INITIAL_VIDEOS_PER_ROW = 4

export const ChannelWithVideos: FC<ChannelWithVideosProps> = memo(({ channelId }) => {
  const videoRows = useVideoGridRows('compact')
  const [videosPerRow, setVideosPerRow] = useState(INITIAL_VIDEOS_PER_ROW)
  const {
    channel,
    loading: channelLoading,
    error: channelError,
  } = useBasicChannel(channelId || '', {
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

  const { url: avatarUrl, isLoadingAsset: isLoadingAvatar } = useAsset(channel?.avatarPhoto)
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
        <VideoTileViewer id={video.id} key={`channels-with-videos-${idx}`} />
      )),
    [displayedVideos, placeholderItems]
  )

  const handleFollowClick = (event: MouseEvent<HTMLButtonElement>) => {
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
            <Text as="h3" variant="h300">
              {channel?.title}
            </Text>
          )}
          {isLoading ? (
            <SkeletonLoader width="80px" height="20px" bottomSpace="8px" />
          ) : (
            <ChannelFollows as="span" variant="t200" color="colorText">
              <NumberFormat as="span" color="colorText" value={channel?.follows || 0} /> followers
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
