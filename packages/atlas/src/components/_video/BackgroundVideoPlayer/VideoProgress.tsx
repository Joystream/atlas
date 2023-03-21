import styled from '@emotion/styled'
import { useEffect, useState } from 'react'

import { cVar, zIndex } from '@/styles'

export type VideoProgressProps = {
  video: HTMLVideoElement | null
  tick?: number
  isPlaying?: boolean
}

export const VideoProgress = ({ tick, video, isPlaying }: VideoProgressProps) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if ((isPlaying || typeof isPlaying === 'undefined') && video) {
      const id = setInterval(() => {
        setProgress(video.currentTime / video.duration)
      }, tick ?? 1000)

      return () => {
        clearInterval(id)
      }
    }
  }, [isPlaying, tick, video])

  return (
    <VideoProgressWrapper>
      <VideoProgressBar progress={isPlaying ? progress : 1} />
    </VideoProgressWrapper>
  )
}

const VideoProgressBar = styled.div<{ progress: number }>`
  width: ${({ progress }) => (progress ? `${progress * 100}%` : 0)};
  min-height: 2px;
  background-color: ${cVar('colorCoreNeutral100')};
`

const VideoProgressWrapper = styled.div`
  min-height: 2px;
  background-color: ${cVar('colorCoreNeutral400Lighten')};
  width: 100%;
  z-index: ${zIndex.modals};
  position: absolute;
  bottom: 0;
`
