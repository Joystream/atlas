import React from 'react'

import { VideoHeroData } from '@/api/featured'
import { useMediaMatch } from '@/hooks/useMediaMatch'
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
  onTileClick,
}) => {
  const smMatch = useMediaMatch('sm')

  const handleChangeTile = (e: React.MouseEvent) => {
    if (smMatch) {
      return
    }
    const clientWidthCenter = e.currentTarget.clientWidth / 2
    if (clientWidthCenter <= e.clientX) {
      const idx = activeVideoIdx + 1 === 3 ? 0 : activeVideoIdx + 1
      onTileClick?.(idx)
    } else {
      const idx = activeVideoIdx - 1 === -1 ? 2 : activeVideoIdx - 1
      onTileClick?.(idx)
    }
  }
  return (
    <VideoHeroSliderWrapper className={className} onClick={handleChangeTile}>
      {loading
        ? Array.from({ length: 3 }).map((_, idx) => (
            <SkeletonLoader key={idx} width={smMatch ? 80 : '100%'} height={smMatch ? 45 : 4} />
          ))
        : videos?.map((video, idx) => (
            <VideoSliderPreview
              key={idx}
              progress={video?.progress}
              thumbnailUrl={video?.thumbnailPhotoUrl}
              active={idx === activeVideoIdx}
              onClick={() => smMatch && onTileClick?.(idx)}
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
