import React from 'react'

import { useNavigate } from 'react-router-dom'
import { VideoPreview } from '@/shared/components'

import routes from '@/config/routes'

type VideoPreviewWithNavigationProps = {
  id: string
  channelId: string
} & React.ComponentProps<typeof VideoPreview>

const VideoPreviewWithNavigation: React.FC<VideoPreviewWithNavigationProps> = ({
  id,
  channelId,
  onClick,
  onChannelClick,
  ...videoPreviewProps
}) => {
  const navigate = useNavigate()
  const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (onClick) {
      onClick(e)
    }
    navigate(routes.video(id))
  }
  const handleChannelClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (onChannelClick) {
      onChannelClick(e)
    }
    navigate(routes.channel(channelId))
  }
  return <VideoPreview {...videoPreviewProps} id={id} onClick={handleClick} onChannelClick={handleChannelClick} />
}

export default VideoPreviewWithNavigation
