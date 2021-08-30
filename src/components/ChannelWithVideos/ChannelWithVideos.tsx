import React, { FC, useState } from 'react'

import { useChannel } from '@/api/hooks'
import { GetVideosConnectionDocument, GetVideosConnectionQuery, GetVideosConnectionQueryVariables } from '@/api/queries'
import { useInfiniteGrid } from '@/components/InfiniteGrids/useInfiniteGrid'
import { VideoTile } from '@/components/VideoTile'
import { absoluteRoutes } from '@/config/routes'
import { useHandleFollowChannel } from '@/hooks'
import { AssetType, useAsset } from '@/providers/assets'
import { Grid } from '@/shared/components/Grid'
import { SkeletonLoader } from '@/shared/components/SkeletonLoader'
import { SentryLogger } from '@/utils/logs'
import { formatNumberShort } from '@/utils/number'

import {
  ChannelCardAnchor,
  ChannelFollows,
  ChannelTitle,
  FollowButton,
  InfoWrapper,
  StyledAvatar,
} from './ChannelWithVideos.style'

type ChannelWithVideosProps = {
  channelId?: string
}

const INITIAL_VIDEOS_PER_ROW = 4
const INITAL_ROWS = 1

export const ChannelWithVideos: FC<ChannelWithVideosProps> = ({ channelId }) => {
  const [videosPerRow, setVideosPerRow] = useState(INITIAL_VIDEOS_PER_ROW)
  const { channel, loading } = useChannel(channelId || '')

  const { url: avatarUrl, isLoadingAsset: isLoadingAvatar } = useAsset({ entity: channel, assetType: AssetType.AVATAR })
  const { toggleFollowing, isFollowing } = useHandleFollowChannel(channelId)
  const { displayedItems, placeholdersCount, error } = useInfiniteGrid<
    GetVideosConnectionQuery,
    GetVideosConnectionQuery['videosConnection'],
    GetVideosConnectionQueryVariables
  >({
    query: GetVideosConnectionDocument,
    isReady: !!channelId,
    skipCount: 0,
    queryVariables: {
      where: {
        channelId_eq: channelId,
        isPublic_eq: true,
        isCensored_eq: false,
      },
    },
    targetRowsCount: INITAL_ROWS,
    dataAccessor: (rawData) => rawData?.videosConnection,
    itemsPerRow: videosPerRow,
    onError: (error) => SentryLogger.error('Failed to fetch videos', 'ChannelWithVideos', error),
  })

  const placeholderItems = Array.from({ length: placeholdersCount }, () => ({ id: undefined }))
  const gridContent = (
    <>
      {[...displayedItems, ...placeholderItems]?.map((video, idx) => (
        <VideoTile id={video.id} key={`channels-with-videos-${idx}`} showChannel />
      ))}
    </>
  )

  const isLoading = !channelId || loading

  if (error) {
    return null
  }

  return (
    <>
      <ChannelCardAnchor to={absoluteRoutes.viewer.channel(channelId)}>
        <StyledAvatar size="channel" loading={isLoading || isLoadingAvatar} assetUrl={avatarUrl} />
        <InfoWrapper>
          {isLoading ? (
            <SkeletonLoader width="120px" height="20px" bottomSpace="4px" />
          ) : (
            <ChannelTitle variant="h6">{channel?.title}</ChannelTitle>
          )}
          {isLoading ? (
            <SkeletonLoader width="80px" height="20px" bottomSpace="8px" />
          ) : (
            <ChannelFollows variant="body2" secondary>
              {formatNumberShort(channel?.follows || 0)} followers
            </ChannelFollows>
          )}
          {isLoading ? (
            <SkeletonLoader width="90px" height="40px" />
          ) : (
            <FollowButton
              variant="secondary"
              size={'medium'}
              onClick={(e) => {
                e.preventDefault()
                toggleFollowing()
              }}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </FollowButton>
          )}
        </InfoWrapper>
      </ChannelCardAnchor>
      <Grid onResize={(sizes) => setVideosPerRow(sizes.length)}>{gridContent}</Grid>
    </>
  )
}
