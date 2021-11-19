import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { VideoHeroData } from '@/api/featured'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { SkeletonLoader } from '@/shared/components/SkeletonLoader'
import { transitions } from '@/shared/theme'

import {
  VideoHeroSliderWrapper,
  VideoSliderPreviewWrapper,
  VideoSliderProgress,
  VideoSliderProgressBar,
  VideoSliderThumbnail,
} from './VideoHeroSlider.style'

export type VideoHeroSliderProps = {
  activeVideoIdx: number
  loading?: boolean
  videos?: (VideoHeroData | null)[]
  onTileClick?: (idx: number) => void
}

export const VideoHeroSlider: React.FC<VideoHeroSliderProps> = ({
  loading,
  videos,
  activeVideoIdx = 0,
  onTileClick,
}) => {
  const smMatch = useMediaMatch('sm')
  const videosLength = videos?.length || 0

  const handleChangeTile = (e: React.MouseEvent) => {
    if (smMatch || !videos) {
      return
    }
    const clientWidthCenter = e.currentTarget.clientWidth / 2

    if (clientWidthCenter <= e.clientX) {
      const idx = activeVideoIdx + 1 >= videosLength ? 0 : activeVideoIdx + 1
      onTileClick?.(idx)
    } else {
      const idx = activeVideoIdx - 1 <= -1 ? videosLength - 1 : activeVideoIdx - 1
      onTileClick?.(idx)
    }
  }

  return (
    <SwitchTransition>
      <CSSTransition
        key={loading ? 'data' : 'placeholder'}
        classNames={transitions.names.fade}
        timeout={parseInt(transitions.timings.regular)}
      >
        <VideoHeroSliderWrapper onClick={handleChangeTile} columnsNumber={videosLength}>
          {loading
            ? Array.from({ length: videosLength }).map((_, idx) => (
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
      </CSSTransition>
    </SwitchTransition>
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
        <VideoSliderProgress style={{ transform: `scaleX(${progress ? progress / 100 : 0})` }} />
      </VideoSliderProgressBar>
    </VideoSliderPreviewWrapper>
  )
}
