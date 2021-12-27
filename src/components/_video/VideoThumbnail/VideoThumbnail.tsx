import React from 'react'

import { ContentOverlay, DefaultOverlay, HoverOverlay, VideoThumbnailContainer } from './VideoThumbnail.styles'

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'

type Slot = {
  element: React.ReactNode
  position: Position
}

export type VideoThumbnailProps = {
  loading?: boolean
  clickable?: boolean
  defaultSlots?: Slot[]
  hoverSlots?: Slot[]
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  loading,
  clickable = true,
  defaultSlots,
  hoverSlots,
}) => {
  return (
    <VideoThumbnailContainer clickable={clickable}>
      <ContentOverlay />
      <DefaultOverlay />
      <HoverOverlay />
    </VideoThumbnailContainer>
  )
}
