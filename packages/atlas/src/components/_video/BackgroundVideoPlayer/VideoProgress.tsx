import styled from '@emotion/styled'
import { useEffect, useMemo, useState } from 'react'

import { cVar, zIndex } from '@/styles'

export type VideoProgressProps = {
  video: HTMLVideoElement | null
  tick?: number
  isPlaying?: boolean
  // limit in seconds for video play time
  limit?: number
  loop?: boolean
}

export const VideoProgress = ({ tick, video, isPlaying, limit, loop }: VideoProgressProps) => {
  const [progress, setProgress] = useState(0)
  const hasVideo = !!video
  useEffect(() => {
    if ((isPlaying || typeof isPlaying === 'undefined') && hasVideo) {
      const id = setInterval(() => {
        const proccessedLimit = limit ? Math.min(limit, video.duration) : video.duration
        if (limit && video.currentTime > proccessedLimit) {
          setProgress(1)
          if (loop) {
            video.currentTime = 0
            video.play()
            return
          }
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
  }, [hasVideo, isPlaying, limit, loop, progress, tick, video, video?.duration])

  const width = useMemo(() => (progress ? `${progress * 100}%` : 1), [progress])
  return (
    <VideoProgressWrapper>
      <VideoProgressBar style={{ width }} />
    </VideoProgressWrapper>
  )
}

const VideoProgressBar = styled.div`
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
