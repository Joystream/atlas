import React from 'react'
import VideoPreviewBase from '../shared/components/VideoPreview/VideoPreviewBase'

type VideoPreviewProps = {
  title: string
  channelName: string
  channelAvatarURL?: string | null
  createdAt: Date
  duration?: number
  // video watch progress in percent (0-100)
  progress?: number
  views?: number | null
  posterURL: string
  showChannel?: boolean
  showMeta?: boolean
  main?: boolean
  onCoverResize?: (width: number | undefined, height: number | undefined) => void
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  onChannelClick?: (e: React.MouseEvent<HTMLElement>) => void
  className?: string
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  title,
  channelName,
  channelAvatarURL,
  createdAt,
  duration,
  progress = 0,
  views,
  posterURL,
  showChannel = true,
  showMeta = true,
  main = false,
  onClick,
  onChannelClick,
  className,
  onCoverResize,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!onClick) {
      return
    }
    e.stopPropagation()
    onClick(e)
  }

  return (
    <VideoPreviewBase
      showChannel={showChannel}
      showMeta={showMeta}
      main={main}
      onClick={onClick && handleClick}
      className={className}
      scalingFactor={scalingFactor}
    />
  )
}

export default VideoPreview
