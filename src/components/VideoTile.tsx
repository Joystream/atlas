import React from 'react'

import { useVideo } from '@/api/hooks'
import { AssetAvailability } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { AssetType, singleDraftSelector, useAsset, useDraftStore } from '@/providers'
import {
  VideoTileBase,
  VideoTileBaseMetaProps,
  VideoTileBaseProps,
  VideoTilePublisherProps,
} from '@/shared/components/VideoTileBase/VideoTileBase'
import { copyToClipboard, openInNewTab } from '@/utils/browser'
import { Logger } from '@/utils/logger'

export type VideoTileProps = {
  id?: string
  onNotFound?: () => void
} & VideoTileBaseMetaProps &
  Pick<VideoTileBaseProps, 'progress' | 'className'>

export const VideoTile: React.FC<VideoTileProps> = ({ id, onNotFound, ...metaProps }) => {
  const { video, loading, videoHref } = useVideoSharedLogic({ id, isDraft: false, onNotFound })
  const { url: thumbnailPhotoUrl } = useAsset({
    entity: video,
    assetType: AssetType.THUMBNAIL,
  })
  const { url: avatarPhotoUrl } = useAsset({
    entity: video?.channel,
    assetType: AssetType.AVATAR,
  })

  return (
    <VideoTileBase
      publisherMode={false}
      title={video?.title}
      channelTitle={video?.channel.title}
      channelAvatarUrl={avatarPhotoUrl}
      createdAt={video?.createdAt}
      duration={video?.duration}
      views={video?.views}
      videoHref={videoHref}
      channelHref={id ? absoluteRoutes.viewer.channel(video?.channel.id) : undefined}
      thumbnailUrl={thumbnailPhotoUrl}
      isLoading={loading}
      contentKey={id}
      {...metaProps}
    />
  )
}

export type VideoTileWPublisherProps = VideoTileProps &
  Omit<VideoTilePublisherProps, 'publisherMode' | 'videoPublishState'>
export const VideoTilePublisher: React.FC<VideoTileWPublisherProps> = ({ id, isDraft, onNotFound, ...metaProps }) => {
  const { video, loading, videoHref } = useVideoSharedLogic({ id, isDraft, onNotFound })
  const draft = useDraftStore(singleDraftSelector(id ?? ''))
  const { url: thumbnailPhotoUrl } = useAsset({
    entity: video,
    assetType: AssetType.THUMBNAIL,
  })
  const { url: avatarPhotoUrl } = useAsset({
    entity: video?.channel,
    assetType: AssetType.AVATAR,
  })

  const hasThumbnailUploadFailed = video?.thumbnailPhotoAvailability === AssetAvailability.Pending

  return (
    <VideoTileBase
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
      contentKey={id}
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
    onError: (error) => Logger.captureError('Failed to fetch video', 'VideoTile', error, { video: { id } }),
  })
  const internalIsLoadingState = loading || !id
  const videoHref = id ? absoluteRoutes.viewer.video(id) : undefined
  return { video, loading: internalIsLoadingState, videoHref }
}
