import React from 'react'
import { useVideo } from '@/api/hooks'
import routes from '@/config/routes'
import VideoPreviewBase, { VideoPreviewBaseMetaProps } from '@/shared/components/VideoPreviewBase/VideoPreviewBase'

type VideoPreviewProps = {
  id?: string
  progress?: number
  className?: string
} & VideoPreviewBaseMetaProps

const VideoPreview: React.FC<VideoPreviewProps> = ({ id, progress, className, ...metaProps }) => {
  const { video, loading } = useVideo(id ?? '', { fetchPolicy: 'cache-first', skip: !id })
  const isLoading = loading || id === undefined
  return (
    <VideoPreviewBase
      title={video?.title}
      channelHandle={video?.channel.handle}
      channelAvatarUrl={video?.channel.avatarPhotoUrl}
      createdAt={video?.createdAt}
      duration={video?.duration}
      views={video?.views}
      thumbnailUrl={video?.thumbnailUrl}
      videoHref={id ? routes.video(id) : undefined}
      channelHref={id ? routes.channel(video?.channel.id) : undefined}
      progress={progress}
      isLoading={isLoading}
      className={className}
      // TODO: handle menu contextMenuCallbacks
      contextMenuCallbacks={{}}
      {...metaProps}
    />
  )
}

export default VideoPreview
