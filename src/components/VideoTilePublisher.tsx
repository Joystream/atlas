import React from 'react'

import { AssetAvailability } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { singleDraftSelector, useDraftStore } from '@/providers/drafts'
import { useUploadsStore } from '@/providers/uploadsManager'
import { VideoTileBase, VideoTilePublisherProps } from '@/shared/components/VideoTileBase'
import { copyToClipboard, openInNewTab } from '@/utils/browser'

import { VideoTileProps, useVideoSharedLogic } from './VideoTile'

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

  const uploadStatus = useUploadsStore((state) => state.uploadsStatus[video?.mediaDataObject?.joystreamContentId || ''])

  const hasThumbnailUploadFailed = video?.thumbnailPhotoAvailability === AssetAvailability.Pending
  const hasVideoUploadFailed = video?.mediaAvailability === AssetAvailability.Pending
  const hasAssetUploadFailed = hasThumbnailUploadFailed || hasVideoUploadFailed

  return (
    <VideoTileBase
      uploadStatus={uploadStatus}
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
      hasAssetUploadFailed={hasAssetUploadFailed}
      channelHref={id ? absoluteRoutes.viewer.channel(video?.channel.id) : undefined}
      isLoading={loading}
      onOpenInTabClick={isDraft || !id ? undefined : () => openInNewTab(absoluteRoutes.viewer.video(id), true)}
      onCopyVideoURLClick={isDraft ? undefined : () => copyToClipboard(videoHref ? location.origin + videoHref : '')}
      isUnlisted={!video?.isPublic || !video?.isPublic === undefined}
      isDraft={isDraft}
      {...metaProps}
    />
  )
}
