import React from 'react'

import { useVideo } from '@/api/hooks'
import { AssetAvailability } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { AssetType, useAsset } from '@/providers/assets'
import { singleDraftSelector, useDraftStore } from '@/providers/drafts'
import {
  VideoTileBase,
  VideoTileBaseMetaProps,
  VideoTileBaseProps,
  VideoTilePublisherProps,
} from '@/shared/components/VideoTileBase'
import { copyToClipboard, openInNewTab } from '@/utils/browser'
import { SentryLogger } from '@/utils/logs'

export type VideoTileProps = {
  id?: string
  onNotFound?: () => void
} & VideoTileBaseMetaProps &
  Pick<VideoTileBaseProps, 'progress' | 'className'>

export const VideoTile: React.FC<VideoTileProps> = ({ id, onNotFound, ...metaProps }) => {
  const { video, loading, videoHref, thumbnailPhotoUrl, avatarPhotoUrl, isLoadingThumbnail, isLoadingAvatar } =
    useVideoSharedLogic({
      id,
      isDraft: false,
      onNotFound,
    })

  return (
    <VideoTileBase
      isLoadingThumbnail={isLoadingThumbnail}
      isLoadingAvatar={isLoadingAvatar}
      publisherMode={false}
      title={video?.title}
      channelTitle={video?.channel.title}
      channelAvatarUrl={avatarPhotoUrl}
      createdAt={video?.createdAt}
      duration={video?.duration}
      views={video?.views}
      videoHref={videoHref}
      channelHref={id ? absoluteRoutes.viewer.channel(video?.channel.id) : undefined}
      onCopyVideoURLClick={() => copyToClipboard(videoHref ? location.origin + videoHref : '')}
      thumbnailUrl={thumbnailPhotoUrl}
      isLoading={loading}
      {...metaProps}
    />
  )
}

export type VideoTileWPublisherProps = VideoTileProps &
  Omit<VideoTilePublisherProps, 'publisherMode' | 'videoPublishState'>
export const VideoTilePublisher: React.FC<VideoTileWPublisherProps> = ({ id, isDraft, onNotFound, ...metaProps }) => {
  const { video, loading, videoHref, thumbnailPhotoUrl, avatarPhotoUrl, isLoadingThumbnail, isLoadingAvatar } =
    useVideoSharedLogic({
      id,
      isDraft,
      onNotFound,
    })
  const draft = useDraftStore(singleDraftSelector(id ?? ''))

  const hasThumbnailUploadFailed = video?.thumbnailPhotoAvailability === AssetAvailability.Pending

  return (
    <VideoTileBase
      isLoadingThumbnail={isLoadingThumbnail}
      isLoadingAvatar={isLoadingAvatar}
      publisherMode
      title={isDraft ? draft?.title : video?.title}
      channelTitle={video?.channel.title}
      channelAvatarUrl={avatarPhotoUrl}
      createdAt={isDraft ? new Date(draft?.updatedAt ?? '') : video?.createdAt}
      duration={video?.duration}
      views={video?.views}
      thumbnailUrl={thumbnailPhotoUrl}
      hasThumbnailUploadFailed={hasThumbnailUploadFailed}
      channelHref={id ? absoluteRoutes.viewer.channel(video?.channel.id) : undefined}
      isLoading={loading}
      onOpenInTabClick={isDraft || !id ? undefined : () => openInNewTab(absoluteRoutes.viewer.video(id), true)}
      onCopyVideoURLClick={isDraft ? undefined : () => copyToClipboard(videoHref ? location.origin + videoHref : '')}
      videoPublishState={video?.isPublic || video?.isPublic === undefined ? 'default' : 'unlisted'}
      isDraft={isDraft}
      {...metaProps}
    />
  )
}

type UseVideoSharedLogicOpts = {
  id?: string
  isDraft?: boolean
  onNotFound?: () => void
}
const useVideoSharedLogic = ({ id, isDraft, onNotFound }: UseVideoSharedLogicOpts) => {
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
