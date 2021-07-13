import React from 'react'

import { useVideo } from '@/api/hooks'
import { AssetAvailability } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { AssetType, singleDraftSelector, useAsset, useDraftStore } from '@/providers'
import {
  VideoPreviewBase,
  VideoPreviewBaseMetaProps,
  VideoPreviewBaseProps,
  VideoPreviewPublisherProps,
} from '@/shared/components/VideoPreviewBase/VideoPreviewBase'
import { copyToClipboard, openInNewTab } from '@/utils/browser'
import { Logger } from '@/utils/logger'

export type VideoPreviewProps = {
  id?: string
  onNotFound?: () => void
} & VideoPreviewBaseMetaProps &
  Pick<VideoPreviewBaseProps, 'progress' | 'className'>

export const VideoPreview: React.FC<VideoPreviewProps> = ({ id, onNotFound, ...metaProps }) => {
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
    <VideoPreviewBase
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

export type VideoPreviewWPublisherProps = VideoPreviewProps &
  Omit<VideoPreviewPublisherProps, 'publisherMode' | 'videoPublishState'>
export const VideoPreviewPublisher: React.FC<VideoPreviewWPublisherProps> = ({
  id,
  isDraft,
  onNotFound,
  ...metaProps
}) => {
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
    <VideoPreviewBase
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
    onError: (error) => Logger.error('Failed to fetch video', error),
  })
  const internalIsLoadingState = loading || !id
  const videoHref = id ? absoluteRoutes.viewer.video(id) : undefined
  return { video, loading: internalIsLoadingState, videoHref }
}
