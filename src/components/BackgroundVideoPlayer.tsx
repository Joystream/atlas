import styled from '@emotion/styled'
import React, { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { transitions } from '@/shared/theme'

type BackgroundVideoPlayerProps = {
  className?: string
  playing?: boolean
} & React.VideoHTMLAttributes<HTMLVideoElement>

const BackgroundVideoPlayer: React.FC<BackgroundVideoPlayerProps> = ({
  playing,
  autoPlay,
  poster,
  onPlay,
  onEnded,
  ...props
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPosterVisible, setIsPosterVisible] = useState(true)
  useEffect(() => {
    if (!videoRef.current) {
      return
    }
    if (playing) {
      videoRef.current.play()
    } else {
      videoRef.current.pause()
    }
  }, [autoPlay, playing])

  const handlePlay = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setIsPosterVisible(false)
    onPlay?.(e)
  }

  const handleEnded = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setIsPosterVisible(true)
    onEnded?.(e)
  }

  return (
    <VideoWrapper>
      <StyledVideo ref={videoRef} onEnded={handleEnded} onPlay={handlePlay} poster={poster} {...props} />
      {poster && (
        <CSSTransition
          in={isPosterVisible}
          unmountOnExit
          mountOnEnter
          classNames={transitions.names.fade}
          timeout={300}
        >
          <VideoPoster src={poster} alt="" />
        </CSSTransition>
      )}
    </VideoWrapper>
  )
}

type VideoWrapperProps = {
  poster?: string
}
export const VideoWrapper = styled.div<VideoWrapperProps>`
  height: 0;
  overflow: hidden;
`

export const VideoPoster = styled.img`
  position: absolute;
  object-fit: cover;
  max-height: 100%;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

export const StyledVideo = styled.video`
  position: absolute;
  object-fit: cover;
  max-height: 100%;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

export default BackgroundVideoPlayer
