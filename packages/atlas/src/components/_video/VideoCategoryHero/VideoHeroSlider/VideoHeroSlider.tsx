import { FC, MouseEvent } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useMediaMatch } from '@/hooks/useMediaMatch'
import { transitions } from '@/styles'

import {
  ThumbnailSkeletonLoader,
  VideoHeroSliderWrapper,
  VideoSliderPreviewWrapper,
  VideoSliderProgress,
  VideoSliderProgressBar,
  VideoSliderThumbnail,
} from './VideoHeroSlider.style'

import { VideoHeroFeaturedVideo } from '../types'

export type VideoHeroSliderProps = {
  activeVideoIdx: number
  videos?: (VideoHeroFeaturedVideo | null)[]
  onTileClick?: (idx: number) => void
}

export const VideoHeroSlider: FC<VideoHeroSliderProps> = ({ videos, activeVideoIdx = 0, onTileClick }) => {
  const smMatch = useMediaMatch('sm')
  const videosLength = videos?.length || 0

  const handleChangeTile = (e: MouseEvent) => {
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
    <VideoHeroSliderWrapper onClick={handleChangeTile} columnsNumber={videosLength}>
      {videos?.map((video, idx) => (
        <VideoSliderPreview
          key={idx}
          progress={video?.progress}
          thumbnailUrl={video?.thumbnailPhotoUrl}
          isLoadingThumbnail={video?.isLoadingThumbnail}
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
  isLoadingThumbnail?: boolean
  thumbnailUrl?: string | null
  mediaUrl?: string
  onClick?: () => void
}

export const VideoSliderPreview: FC<VideoSliderPreviewProps> = ({
  progress,
  active,
  thumbnailUrl,
  isLoadingThumbnail,
  onClick,
}) => {
  const smMatch = useMediaMatch('sm')
  return (
    <SwitchTransition>
      <CSSTransition
        key={isLoadingThumbnail ? 'data' : 'placeholder'}
        classNames={transitions.names.fade}
        timeout={parseInt(transitions.timings.regular)}
      >
        <VideoSliderPreviewWrapper onClick={onClick}>
          {isLoadingThumbnail ? (
            <ThumbnailSkeletonLoader active={active} width={smMatch ? 80 : '100%'} height={smMatch ? 45 : 4} />
          ) : (
            <VideoSliderThumbnail src={thumbnailUrl || ''} active={active} />
          )}

          <VideoSliderProgressBar active={active}>
            <VideoSliderProgress style={{ transform: `scaleX(${progress ? progress / 100 : 0})` }} />
          </VideoSliderProgressBar>
        </VideoSliderPreviewWrapper>
      </CSSTransition>
    </SwitchTransition>
  )
}
