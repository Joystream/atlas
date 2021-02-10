import { useVideo } from '@/api/hooks'
import routes from '@/config/routes'
import React from 'react'
import VideoPreviewBase from '../shared/components/VideoPreviewBase/VideoPreviewBase'

type VideoPreviewProps = {
  id?: string
  showChannel?: boolean
  showMeta?: boolean
  main?: boolean
  progress?: number
  onCoverResize?: (width: number | undefined, height: number | undefined) => void
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  onChannelClick?: (e: React.MouseEvent<HTMLElement>) => void
  className?: string
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  id,
  showChannel = true,
  showMeta = true,
  main = false,
  progress,
  className,
  onCoverResize,
  onChannelClick,
  onClick,
}) => {
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
      videoHref={id ? routes.video(video?.id) : undefined}
      channelHref={id ? routes.channel(video?.channel.id) : undefined}
      progress={progress}
      isLoading={isLoading}
      showChannel={showChannel}
      showMeta={showMeta}
      main={main}
      className={className}
      onCoverResize={onCoverResize}
      onChannelClick={onChannelClick}
      onClick={onClick}
    />
  )
}

export default VideoPreview
