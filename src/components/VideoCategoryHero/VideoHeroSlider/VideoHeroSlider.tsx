import React from 'react'

import { VideoHeroData } from '@/api/featured'
import { SkeletonLoader } from '@/shared/components/SkeletonLoader'

import {
  VideoHeroSliderWrapper,
  VideoSliderPreviewWrapper,
  VideoSliderProgress,
  VideoSliderProgressBar,
  VideoSliderThumbnail,
} from './VideoHeroSlider.style'

export type VideoHeroSliderProps = {
  isMobile?: boolean
  activeVideoIdx: number
  loading?: boolean
  className?: string
  videos?: (VideoHeroData | null)[]
  onTileClick?: (idx: number) => void
  progress?: number
}

export const VideoHeroSlider: React.FC<VideoHeroSliderProps> = ({
  loading,
  className,
  videos,
  activeVideoIdx = 0,
  progress,
  onTileClick,
}) => {
  return (
    <VideoHeroSliderWrapper className={className}>
      {loading
        ? Array.from({ length: 3 }).map((_, idx) => <SkeletonLoader key={idx} width={80} height={45} />)
        : videos?.map((video, idx) => (
            <VideoSliderPreview
              key={idx}
              progress={progress}
              thumbnailUrl={video?.thumbnailPhotoUrl}
              active={idx === activeVideoIdx}
              onClick={() => onTileClick?.(idx)}
            />
          ))}
    </VideoHeroSliderWrapper>
  )
}

type VideoSliderPreviewProps = {
  progress?: number
  active?: boolean
  thumbnailUrl?: string | null
  mediaUrl?: string
  onClick?: () => void
}

export const VideoSliderPreview: React.FC<VideoSliderPreviewProps> = ({ progress, active, thumbnailUrl, onClick }) => {
  return (
    <VideoSliderPreviewWrapper onClick={onClick}>
      <VideoSliderThumbnail src={thumbnailUrl || ''} active={active} />
      <VideoSliderProgressBar active={active}>
        <VideoSliderProgress progress={progress} />
      </VideoSliderProgressBar>
    </VideoSliderPreviewWrapper>
  )
}
