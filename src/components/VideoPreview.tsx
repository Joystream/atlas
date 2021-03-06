import React from 'react'
import { useVideo } from '@/api/hooks'
import routes from '@/config/routes'
import VideoPreviewBase, {
  VideoPreviewBaseMetaProps,
  VideoPreviewPublisherProps,
} from '@/shared/components/VideoPreviewBase/VideoPreviewBase'

export type VideoPreviewProps = {
  id?: string
  progress?: number
  isLoading?: boolean
  className?: string
} & VideoPreviewBaseMetaProps &
  VideoPreviewPublisherProps

const VideoPreview: React.FC<VideoPreviewProps> = ({
  id,
  className,
  isLoading = false,
  videoPublishState,
  ...metaProps
}) => {
  const { video, loading } = useVideo(id ?? '', { fetchPolicy: 'cache-first', skip: !id })
  const _isLoading = loading || id === undefined || isLoading

  const videoHref = id ? routes.video(id) : undefined
  return (
    <VideoPreviewBase
      title={video?.title}
      channelHandle={video?.channel.handle}
      channelAvatarUrl={video?.channel.avatarPhotoUrl}
      createdAt={video?.createdAt}
      duration={video?.duration}
      views={video?.views}
      thumbnailUrl={video?.thumbnailUrl}
      videoHref={videoHref}
      channelHref={id ? routes.channel(video?.channel.id) : undefined}
      isLoading={_isLoading}
      className={className}
      contextMenuCallbacks={{
        onEditVideoClick: () => ({}),
        onCopyVideoURLClick:
          videoPublishState === 'draft'
            ? undefined
            : () => navigator.clipboard.writeText(videoHref ? location.origin + videoHref : ''),
        onDeleteVideoClick: () => ({}),
      }}
      {...metaProps}
    />
  )
}

export default VideoPreview
