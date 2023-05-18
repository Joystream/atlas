import styled from '@emotion/styled'
import { useEffect, useState } from 'react'

import { cVar, zIndex } from '@/styles'

export type VideoProgressProps = {
  video: HTMLVideoElement | null
  tick?: number
  isPlaying?: boolean
  // limit in seconds for video play time
  limit?: number
}

export const VideoProgress = ({ tick, video, isPlaying, limit }: VideoProgressProps) => {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if ((isPlaying || typeof isPlaying === 'undefined') && video) {
      const id = setInterval(() => {
        const proccessedLimit = limit ? (limit < video.duration ? limit : video.duration) : video.duration
        if (limit && video.currentTime > proccessedLimit) {
          setProgress(1)
          video.currentTime = video.duration
          clearInterval(id)
          return
        }
        setProgress(video.currentTime / proccessedLimit)
      }, tick ?? 1000)

      return () => {
        clearInterval(id)
      }
    }
  }, [isPlaying, limit, progress, tick, video, video?.duration])

  return (
    <VideoProgressWrapper>
      <VideoProgressBar progress={progress ?? 1} />
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
