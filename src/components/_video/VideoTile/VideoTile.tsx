import React from 'react'

import { useVideo } from '@/api/hooks'
import { absoluteRoutes } from '@/config/routes'
import { AssetType, useAsset } from '@/providers/assets'
import { SentryLogger } from '@/utils/logs'

import { VideoTileContainer } from './VideoTile.styles'

import { VideoThumbnail } from '../VideoThumbnail'
import { VideoTileDetails } from '../VideoTileDetails'

export type VideoTileProps = {
  direction: 'vertical' | 'horizontal'
}

export const VideoTile: React.FC<VideoTileProps> = React.memo(({ direction = 'vertical' }) => {
  const { video, avatarPhotoUrl, thumbnailPhotoUrl, loading } = useVideoSharedLogic({ id: '10' })

  return (
    <VideoTileContainer direction={direction}>
      <VideoThumbnail thumbnailUrl={thumbnailPhotoUrl} />
      <VideoTileDetails channelAvatarUrl={avatarPhotoUrl} video={video} loading={loading} />
    </VideoTileContainer>
  )
})

VideoTile.displayName = 'VideoTile'

type UseVideoSharedLogicOpts = {
  id?: string
  isDraft?: boolean
  onNotFound?: () => void
}
export const useVideoSharedLogic = ({ id, isDraft, onNotFound }: UseVideoSharedLogicOpts) => {
  const { video, loading } = useVideo(id ?? '', {
    skip: !id || isDraft,
    onCompleted: (data) => !data && onNotFound?.(),
    onError: (error) => SentryLogger.error('Failed to fetch video', 'VideoTile', error, { video: { id } }),
  })
  const { url: thumbnailPhotoUrl, isLoadingAsset: isLoadingThumbnail } = useAsset({
    entity: video,
    assetType: AssetType.THUMBNAIL,
  })
  const { url: avatarPhotoUrl, isLoadingAsset: isLoadingAvatar } = useAsset({
    entity: video?.channel,
    assetType: AssetType.AVATAR,
  })

  const internalIsLoadingState = loading || !id
  const videoHref = id ? absoluteRoutes.viewer.video(id) : undefined
  return {
    video,
    loading: internalIsLoadingState,
    isLoadingThumbnail,
    isLoadingAvatar,
    thumbnailPhotoUrl,
    avatarPhotoUrl,
    videoHref,
  }
}
