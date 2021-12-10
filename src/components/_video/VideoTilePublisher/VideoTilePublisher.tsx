import React, { useCallback } from 'react'

import { VideoTileProps, useVideoSharedLogic } from '@/components/_video/VideoTile'
import { absoluteRoutes } from '@/config/routes'
import { singleDraftSelector, useDraftStore } from '@/providers/drafts'
import { useUploadsStore } from '@/providers/uploadsManager'
import { copyToClipboard, openInNewTab } from '@/utils/browser'

import { VideoTileBase, VideoTilePublisherProps } from '../VideoTileBase'

export type VideoTileWPublisherProps = VideoTileProps &
  Omit<VideoTilePublisherProps, 'publisherMode' | 'videoPublishState'>
export const VideoTilePublisher: React.FC<VideoTileWPublisherProps> = React.memo(
  ({ id, isDraft, onNotFound, ...metaProps }) => {
    const { video, loading, videoHref, thumbnailPhotoUrl, avatarPhotoUrl, isLoadingThumbnail, isLoadingAvatar } =
      useVideoSharedLogic({
        id,
        isDraft,
        onNotFound,
      })

    const draft = useDraftStore(singleDraftSelector(id ?? ''))

    const uploadStatus = useUploadsStore((state) => state.uploadsStatus[video?.media?.id || ''])

    const hasThumbnailUploadFailed = (video?.thumbnailPhoto && !video.thumbnailPhoto.isAccepted) || false
    const hasVideoUploadFailed = (video?.media && !video.media.isAccepted) || false
    const hasAssetUploadFailed = hasThumbnailUploadFailed || hasVideoUploadFailed
    const handleCopyVideoURLClick = useCallback(() => {
      copyToClipboard(videoHref ? location.origin + videoHref : '')
    }, [videoHref])

    return (
      <VideoTileBase
        uploadStatus={uploadStatus}
        videoHref={
          !isDraft
            ? hasAssetUploadFailed
              ? {
                  pathname: absoluteRoutes.studio.uploads(),
                  state: { highlightFailed: true },
                }
              : absoluteRoutes.viewer.video(video?.id)
            : undefined
        }
        openInNewBrowserTab={!isDraft && !hasAssetUploadFailed}
        isLoadingThumbnail={isLoadingThumbnail}
        isLoadingAvatar={isLoadingAvatar}
        publisherMode
        title={isDraft ? draft?.title : video?.title}
        channelTitle={video?.channel?.title}
        channelAvatarUrl={avatarPhotoUrl}
        createdAt={isDraft ? new Date(draft?.updatedAt ?? '') : video?.createdAt}
        duration={video?.duration}
        views={video?.views}
        thumbnailUrl={thumbnailPhotoUrl}
        hasAssetUploadFailed={hasAssetUploadFailed}
        channelHref={id ? absoluteRoutes.viewer.channel(video?.channel?.id) : undefined}
        isLoading={loading}
        onOpenInTabClick={isDraft || !id ? undefined : () => openInNewTab(absoluteRoutes.viewer.video(id), true)}
        onCopyVideoURLClick={isDraft ? undefined : handleCopyVideoURLClick}
        isUnlisted={!video?.isPublic || !video?.isPublic === undefined}
        isDraft={isDraft}
        {...metaProps}
      />
    )
  }
)
VideoTilePublisher.displayName = 'VideoTilePublisher'
