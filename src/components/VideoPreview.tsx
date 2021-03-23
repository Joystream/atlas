import React from 'react'
import { useVideo } from '@/api/hooks'
import routes from '@/config/routes'
import VideoPreviewBase, {
  VideoPreviewBaseMetaProps,
  VideoPreviewBaseProps,
  VideoPreviewPublisherProps,
} from '@/shared/components/VideoPreviewBase/VideoPreviewBase'
import { useDrafts } from '@/hooks'
import { copyToClipboard } from '@/utils/broswer'

export type VideoPreviewProps = {
  id?: string
} & VideoPreviewBaseMetaProps &
  Pick<VideoPreviewBaseProps, 'progress' | 'isLoading' | 'className'>

const VideoPreview: React.FC<VideoPreviewProps> = ({ id, isLoading = false, ...metaProps }) => {
  const { video, internalIsLoadingState, videoHref } = useVideoSharedLogic(id, isLoading, false)
  return (
    <VideoPreviewBase
      publisherMode={false}
      title={video?.title}
      channelHandle={video?.channel.handle}
      channelAvatarUrl={video?.channel.avatarPhotoUrl}
      createdAt={video?.createdAt}
      duration={video?.duration}
      views={video?.views}
      thumbnailUrl={video?.thumbnailUrl}
      videoHref={videoHref}
      channelHref={id ? routes.channel(video?.channel.id) : undefined}
      isLoading={internalIsLoadingState}
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
  isLoading = false,
  isDraft,
  ...metaProps
}) => {
  const { video, internalIsLoadingState, videoHref } = useVideoSharedLogic(id, isLoading, isDraft)
  const { drafts } = useDrafts('video')
  const draft = id ? drafts.find((draft) => draft.id === id) : undefined
  return (
    <VideoPreviewBase
      publisherMode
      title={isDraft ? draft?.title : video?.title}
      channelHandle={video?.channel.handle}
      channelAvatarUrl={video?.channel.avatarPhotoUrl}
      createdAt={isDraft ? new Date(draft?.updatedAt ?? '') : video?.createdAt}
      duration={video?.duration}
      views={video?.views}
      thumbnailUrl={video?.thumbnailUrl}
      videoHref={videoHref}
      channelHref={id ? routes.channel(video?.channel.id) : undefined}
      isLoading={internalIsLoadingState}
      onCopyVideoURLClick={isDraft ? undefined : () => copyToClipboard(videoHref ? location.origin + videoHref : '')}
      videoPublishState={video?.isPublic || video?.isPublic === undefined ? 'default' : 'unlisted'}
      isDraft={isDraft}
      contentKey={id}
      {...metaProps}
    />
  )
}

const useVideoSharedLogic = (id?: string, isLoading?: boolean, isDraft?: boolean) => {
  const { video, loading } = useVideo(id ?? '', { skip: !id || isDraft })
  const internalIsLoadingState = loading || !id || isLoading
  const videoHref = id ? routes.video(id) : undefined
  return { video, internalIsLoadingState, videoHref }
}
