import parse from 'html-react-parser'
import React, { useMemo } from 'react'

import { AllChannelFieldsFragment, VideoFieldsFragment } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { AssetType, useAsset } from '@/providers/assets'
import { usePersonalDataStore } from '@/providers/personalData'
import { Text } from '@/shared/components/Text'

import { ResultWrapper } from './ResultWrapper'
import { ResultContent, ResultThumbnail, StyledSkeletonLoader } from './SearchBox.style'

type ResultProps = {
  video?: VideoFieldsFragment
  channel?: AllChannelFieldsFragment
  query?: string
}

export const Result: React.FC<ResultProps> = ({ video, channel, query }) => {
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

  const highlightedTitle = useMemo(() => {
    const title = video ? video.title : channel?.title
    if (query) {
      const regex = new RegExp(query, 'i')
      return title ? title.replace(regex, (match) => `<span style="color: white">${match}</span>`) : ''
    }
    return title || ''
  }, [channel?.title, query, video])

  const handleResultClick = () => {
    if (video) {
      updateRecentSearches(video.id, 'video', video.title || '')
    }
    if (channel) {
      updateRecentSearches(channel.id, 'channel', channel.title || '')
    }
  }

  return (
    <ResultWrapper to={to} onClick={handleResultClick}>
      <ResultContent>
        {isLoading ? (
          <StyledSkeletonLoader width={video ? '64px' : '32px'} height={video ? '40px' : '32px'} rounded={!!channel} />
        ) : (
          <ResultThumbnail src={(video ? videoThumbnail : channelAvatar) || ''} rounded={!!channel} />
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
