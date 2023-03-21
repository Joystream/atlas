import styled from '@emotion/styled'
import { FC, SyntheticEvent, VideoHTMLAttributes, useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { SvgActionPause, SvgActionPlay, SvgActionSoundOff, SvgActionSoundOn } from '@/assets/icons'
import { Button } from '@/components/_buttons/Button'
import { VideoProgress } from '@/components/_video/BackgroundVideoPlayer/VideoProgress'
import { sizes, transitions, zIndex } from '@/styles'
import { ConsoleLogger } from '@/utils/logs'

type BackgroundVideoPlayerProps = {
  className?: string
  playing?: boolean
  handleActions?: boolean
  videoPlaytime?: number
} & VideoHTMLAttributes<HTMLVideoElement>

export const BackgroundVideoPlayer: FC<BackgroundVideoPlayerProps> = ({
  autoPlay,
  playing,
  poster,
  playsInline = true,
  onPlay,
  onEnded,
  src,
  handleActions,
  videoPlaytime,
  ...props
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPosterVisible, setIsPosterVisible] = useState(true)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(true)

  const initialRender = useRef(true)
  useEffect(() => {
    // do this checking only once
    if (initialRender.current === false) return
    initialRender.current = false
    if (playing === false && autoPlay) {
      ConsoleLogger.warn(`BackgroundVideoPlayer: if "playing" prop is initially set to false, "autoPlay" won't work`)
    }
  }, [autoPlay, playing])

  const playVideo = () => {
    videoRef.current?.play().then(() => {
      setIsPlaying(true)
      setIsPosterVisible(false)
    })
  }

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
      setIsPosterVisible(true)
    }
  }

  useEffect(() => {
    // show poster again when src changes
    setIsPosterVisible(true)
    if (!videoRef.current || playing === undefined) {
      return
    }
    if (playing) {
      playVideo()
    } else {
      pauseVideo()
    }
  }, [handleActions, playing, src])

  const handlePlay = (e: SyntheticEvent<HTMLVideoElement, Event>) => {
    setIsPosterVisible(false)
    setIsPlaying(true)
    onPlay?.(e)
  }

  const handleEnded = (e: SyntheticEvent<HTMLVideoElement, Event>) => {
    setIsPosterVisible(true)
    setIsPlaying(false)
    onEnded?.(e)
  }

  return (
    <VideoWrapper>
      {handleActions && (
        <ButtonBox>
          <Button
            onClick={isPlaying ? pauseVideo : playVideo}
            icon={isPlaying ? <SvgActionPause /> : <SvgActionPlay />}
            variant="tertiary"
          />
          <Button
            onClick={() => setIsMuted((prev) => !prev)}
            icon={isMuted ? <SvgActionSoundOff /> : <SvgActionSoundOn />}
            variant="tertiary"
          />
        </ButtonBox>
      )}
      {playing && <VideoProgress video={videoRef.current} isPlaying={isPlaying} tick={10} limit={videoPlaytime} />}
      <StyledVideo
        src={src}
        autoPlay={autoPlay}
        playsInline={playsInline}
        ref={videoRef}
        onEnded={handleEnded}
        onPlay={handlePlay}
        poster={poster}
        {...props}
        muted={handleActions ? isMuted : props.muted}
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

  :hover {
    & + span {
      opacity: 0;
    }
  }
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

const ButtonBox = styled.div`
  position: absolute;
  bottom: 32px;
  right: 32px;
  z-index: ${zIndex.modals};
  display: flex;
  gap: ${sizes(4)};
`
