import styled from '@emotion/styled'
import React, { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { transitions } from '@/shared/theme'
import { ConsoleLogger } from '@/utils/logs'

type BackgroundVideoPlayerProps = {
  className?: string
  playing?: boolean
} & React.VideoHTMLAttributes<HTMLVideoElement>

export const BackgroundVideoPlayer: React.FC<BackgroundVideoPlayerProps> = ({
  autoPlay,
  playing,
  poster,
  playsInline = true,
  onPlay,
  onEnded,
  ...props
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPosterVisible, setIsPosterVisible] = useState(true)

  const initialRender = useRef(true)
  useEffect(() => {
    // do this checking only once
    if (initialRender.current === false) return
    initialRender.current = false
    if (playing === false && autoPlay) {
      ConsoleLogger.warn(`BackgroundVideoPlayer: if "playing" prop is initially set to false, "autoPlay" won't work`)
    }
  }, [autoPlay, playing])

  useEffect(() => {
    if (!videoRef.current) {
      return
    }
    if (playing) {
      videoRef.current.play()
    } else {
      videoRef.current.pause()
    }
  }, [playing])

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
      <StyledVideo
        autoPlay={autoPlay}
        playsInline={playsInline}
        ref={videoRef}
        onEnded={handleEnded}
        onPlay={handlePlay}
        poster={poster}
        {...props}
      />
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
