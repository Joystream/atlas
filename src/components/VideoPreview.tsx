import React from 'react'

import { useVideo } from '@/api/hooks'
import { AssetAvailability } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { useDrafts, useAuthorizedUser, useAsset } from '@/hooks'
import VideoPreviewBase, {
  VideoPreviewBaseMetaProps,
  VideoPreviewBaseProps,
  VideoPreviewPublisherProps,
} from '@/shared/components/VideoPreviewBase/VideoPreviewBase'
import { copyToClipboard } from '@/utils/broswer'

export type VideoPreviewProps = {
  id?: string
  onNotFound?: () => void
} & VideoPreviewBaseMetaProps &
  Pick<VideoPreviewBaseProps, 'progress' | 'className'>

const VideoPreview: React.FC<VideoPreviewProps> = ({ id, onNotFound, ...metaProps }) => {
  const { video, loading, videoHref } = useVideoSharedLogic({ id, isDraft: false, onNotFound })
  const { getAssetUrl } = useAsset()

  const thumbnailPhotoUrl = getAssetUrl(
    video?.thumbnailPhotoAvailability,
    video?.thumbnailPhotoUrls,
    video?.thumbnailPhotoDataObject
  )
  const avatarPhotoUrl = getAssetUrl(
    video?.channel?.avatarPhotoAvailability,
    video?.channel?.avatarPhotoUrls,
    video?.channel?.avatarPhotoDataObject
  )
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

export default VideoPreview

export type VideoPreviewWPublisherProps = VideoPreviewProps &
  Omit<VideoPreviewPublisherProps, 'publisherMode' | 'videoPublishState'>
export const VideoPreviewPublisher: React.FC<VideoPreviewWPublisherProps> = ({
  id,
  isDraft,
  onNotFound,
  ...metaProps
}) => {
  const { video, loading, videoHref } = useVideoSharedLogic({ id, isDraft, onNotFound })
  const { activeChannelId } = useAuthorizedUser()
  const { drafts } = useDrafts('video', activeChannelId)
  const draft = id ? drafts.find((draft) => draft.id === id) : undefined
  const { getAssetUrl } = useAsset()

  const thumbnailPhotoUrl = getAssetUrl(
    video?.thumbnailPhotoAvailability,
    video?.thumbnailPhotoUrls,
    video?.thumbnailPhotoDataObject
  )
  const avatarPhotoUrl = getAssetUrl(
    video?.channel.avatarPhotoAvailability,
    video?.channel.avatarPhotoUrls,
    video?.channel.avatarPhotoDataObject
  )

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
    onError: (error) => console.error('Failed to fetch video', error),
  })
  const internalIsLoadingState = loading || !id
  const videoHref = id ? absoluteRoutes.viewer.video(id) : undefined
  return { video, loading: internalIsLoadingState, videoHref }
}
