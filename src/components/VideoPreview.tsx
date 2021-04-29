import React from 'react'
import { useVideo } from '@/api/hooks'
import { absoluteRoutes } from '@/config/routes'
import VideoPreviewBase, {
  VideoPreviewBaseMetaProps,
  VideoPreviewBaseProps,
  VideoPreviewPublisherProps,
} from '@/shared/components/VideoPreviewBase/VideoPreviewBase'
import { useDrafts, useActiveUser } from '@/hooks'
import { copyToClipboard } from '@/utils/broswer'
import { createUrlFromAsset } from '@/utils/asset'

export type VideoPreviewProps = {
  id?: string
} & VideoPreviewBaseMetaProps &
  Pick<VideoPreviewBaseProps, 'progress' | 'className'>

const VideoPreview: React.FC<VideoPreviewProps> = ({ id, ...metaProps }) => {
  const { video, loading, videoHref } = useVideoSharedLogic(id, false)

  const thumbnailPhotoUrl = createUrlFromAsset(
    video?.thumbnailPhotoAvailability,
    video?.thumbnailPhotoUrls,
    video?.thumbnailPhotoDataObject
  )
  const avatarPhotoUrl = createUrlFromAsset(
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
export const VideoPreviewPublisher: React.FC<VideoPreviewWPublisherProps> = ({ id, isDraft, ...metaProps }) => {
  const { video, loading, videoHref } = useVideoSharedLogic(id, isDraft)
  const { activeUser } = useActiveUser()
  const channelId = activeUser.channelId ?? ''
  const { drafts } = useDrafts('video', channelId)
  const draft = id ? drafts.find((draft) => draft.id === id) : undefined

  const thumbnailPhotoUrl = createUrlFromAsset(
    video?.thumbnailPhotoAvailability,
    video?.thumbnailPhotoUrls,
    video?.thumbnailPhotoDataObject
  )
  const avatarPhotoUrl = createUrlFromAsset(
    video?.channel.avatarPhotoAvailability,
    video?.channel.avatarPhotoUrls,
    video?.channel.avatarPhotoDataObject
  )

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

const useVideoSharedLogic = (id?: string, isDraft?: boolean) => {
  const { video, loading } = useVideo(id ?? '', { skip: !id || isDraft })
  const internalIsLoadingState = loading || !id
  const videoHref = id ? absoluteRoutes.viewer.video(id) : undefined
  return { video, loading: internalIsLoadingState, videoHref }
}
