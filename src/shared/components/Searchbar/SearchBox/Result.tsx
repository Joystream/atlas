import parse from 'html-react-parser'
import React, { useMemo } from 'react'

import { AllChannelFieldsFragment, VideoFieldsFragment } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { AssetType, useAsset } from '@/providers/assets'
import { usePersonalDataStore } from '@/providers/personalData'
import { useHighlitedTitle } from '@/shared/components/Searchbar/SearchBox/useHighlitedTitle'
import { Text } from '@/shared/components/Text'

import { ResultWrapper } from './ResultWrapper'
import { ResultContent, ResultThumbnail, StyledSkeletonLoader, StyledSvgAvatarSilhouette } from './SearchBox.style'

type ResultProps = {
  video?: VideoFieldsFragment
  channel?: AllChannelFieldsFragment
  query?: string
}

export const Result: React.FC<ResultProps> = ({ video, channel, query }) => {
  const title = video ? video.title : channel?.title
  const highlightedTitle = useHighlitedTitle(title, query)
  const { updateRecentSearches } = usePersonalDataStore((state) => ({
    updateRecentSearches: state.actions.updateRecentSearches,
  }))
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

  const handleResultClick = () => {
    if (video) {
      updateRecentSearches(video.id, 'video', video.title || '')
    }
    if (channel) {
      updateRecentSearches(channel.id, 'channel', channel.title || '')
    }
  }

  const thumbnailUrl = video ? videoThumbnail : channelAvatar

  return (
    <ResultWrapper to={to} onClick={handleResultClick}>
      <ResultContent>
        {isLoading ? (
          <StyledSkeletonLoader width={video ? '64px' : '32px'} height={video ? '40px' : '32px'} rounded={!!channel} />
        ) : channel && !thumbnailUrl ? (
          <StyledSvgAvatarSilhouette width={32} height={32} />
        ) : (
          <ResultThumbnail src={thumbnailUrl || ''} rounded={!!channel} />
        )}
        <div>
          <Text secondary>{parse(highlightedTitle)}</Text>
          <Text secondary variant="caption">
            {video ? video.channel.title : `${channel?.follows} ${channel?.follows === 1 ? 'Follower' : 'Followers'}`}
          </Text>
        </div>
      </ResultContent>
    </ResultWrapper>
  )
}
