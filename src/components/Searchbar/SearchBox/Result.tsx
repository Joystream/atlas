import React, { useCallback, useMemo } from 'react'

import { AllChannelFieldsFragment, VideoFieldsFragment } from '@/api/queries'
import { ResultTitle } from '@/components/Searchbar/SearchBox/ResultTitle'
import { Text } from '@/components/Text'
import { absoluteRoutes } from '@/config/routes'
import { AssetType, useAsset } from '@/providers/assets'

import { ResultWrapper } from './ResultWrapper'
import {
  ResultContent,
  ResultThumbnail,
  StyledSkeletonLoader,
  StyledSvgAvatarSilhouette,
  Title,
} from './SearchBox.styles'

type ResultProps = {
  video?: VideoFieldsFragment
  channel?: AllChannelFieldsFragment
  query?: string
  selected?: boolean
  handleSelectedItem: (top: number, title?: string | null) => void
  selectedItem: null | number
}

export const Result: React.FC<ResultProps> = ({
  video,
  channel,
  query,
  selected,
  handleSelectedItem,
  selectedItem,
}) => {
  const title = video ? video.title : channel?.title
  const { url: channelAvatar, isLoadingAsset: channelAvatarLoading } = useAsset({
    entity: channel,
    assetType: AssetType.AVATAR,
  })
  const { url: videoThumbnail, isLoadingAsset: videoThumbnailLoading } = useAsset({
    entity: video,
    assetType: AssetType.THUMBNAIL,
  })
  const to = useMemo(() => {
    if (video) {
      return absoluteRoutes.viewer.video(video.id)
    }
    if (channel) {
      return absoluteRoutes.viewer.channel(channel.id)
    }
    return ''
  }, [video, channel])

  const isLoading = video ? videoThumbnailLoading : channelAvatarLoading

  const thumbnailUrl = video ? videoThumbnail : channelAvatar

  const onSelected = useCallback(
    (top: number) => {
      handleSelectedItem(top, title)
    },
    [handleSelectedItem, title]
  )

  return (
    <ResultWrapper to={to} selected={selected} handleSelectedItem={onSelected} selectedItem={selectedItem}>
      <ResultContent>
        {isLoading ? (
          <StyledSkeletonLoader width={video ? '64px' : '32px'} height={video ? '40px' : '32px'} rounded={!!channel} />
        ) : channel && !thumbnailUrl ? (
          <StyledSvgAvatarSilhouette width={32} height={32} />
        ) : (
          <ResultThumbnail src={thumbnailUrl || ''} rounded={!!channel} />
        )}
        <div>
          <Title secondary={!selected} variant="t200-strong">
            <ResultTitle title={title} query={query} />
          </Title>
          <Text secondary variant="t100">
            {video ? video.channel?.title : `${channel?.follows} ${channel?.follows === 1 ? 'Follower' : 'Followers'}`}
          </Text>
        </div>
      </ResultContent>
    </ResultWrapper>
  )
}
