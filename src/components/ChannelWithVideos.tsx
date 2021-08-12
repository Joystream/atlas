import styled from '@emotion/styled'
import React, { FC, useState } from 'react'
import { Link } from 'react-router-dom'

import { useChannel } from '@/api/hooks'
import { GetVideosConnectionDocument, GetVideosConnectionQuery, GetVideosConnectionQueryVariables } from '@/api/queries'
import { useInfiniteGrid } from '@/components/InfiniteGrids/useInfiniteGrid'
import { VideoTile } from '@/components/VideoTile'
import { absoluteRoutes } from '@/config/routes'
import { useHandleFollowChannel } from '@/hooks'
import { AssetType, useAsset } from '@/providers'
import { Avatar, Button, Grid, SkeletonLoader, Text } from '@/shared/components'
import { sizes } from '@/shared/theme'
import { formatNumberShort } from '@/utils/number'

type ChannelWithVideosProps = {
  channelId?: string
}

const INITIAL_VIDEOS_PER_ROW = 4
const INITAL_ROWS = 1

export const ChannelWithVideos: FC<ChannelWithVideosProps> = ({ channelId }) => {
  const [videosPerRow, setVideosPerRow] = useState(INITIAL_VIDEOS_PER_ROW)
  const { channel, loading } = useChannel(channelId || '')

  const { url: avatarUrl } = useAsset({ entity: channel, assetType: AssetType.AVATAR })
  const { toggleFollowing, isFollowing } = useHandleFollowChannel(channelId)
  const { displayedItems, placeholdersCount } = useInfiniteGrid<
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

  return (
    <>
      <ChannelCardAnchor to={absoluteRoutes.viewer.channel(channelId)}>
        <StyledAvatar size="channel" loading={isLoading} assetUrl={avatarUrl} />
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
            <FollowButton variant="secondary" size={'medium'} onClick={() => toggleFollowing()}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </FollowButton>
          )}
        </InfoWrapper>
      </ChannelCardAnchor>
      <Grid onResize={(sizes) => setVideosPerRow(sizes.length)}>{gridContent}</Grid>
    </>
  )
}

const ChannelCardAnchor = styled(Link)`
  text-decoration: none;
  align-items: center;
  transition: transform, box-shadow;
  display: inline-flex;
  justify-content: unset;
  margin-bottom: ${sizes(10)};
`

const StyledAvatar = styled(Avatar)`
  margin-right: ${sizes(6)};
`

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const ChannelTitle = styled(Text)`
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ChannelFollows = styled(Text)`
  margin-top: ${sizes(1)};
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const FollowButton = styled(Button)`
  margin-top: ${sizes(2)};
`
