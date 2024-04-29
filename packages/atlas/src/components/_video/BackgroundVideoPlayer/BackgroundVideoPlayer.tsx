import { FC, SyntheticEvent, VideoHTMLAttributes, useCallback, useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { SvgActionPause, SvgActionPlay, SvgActionSoundOff, SvgActionSoundOn } from '@/assets/icons'
import { Button } from '@/components/_buttons/Button'
import { VideoProgress } from '@/components/_video/BackgroundVideoPlayer/VideoProgress'
import { transitions } from '@/styles'
import { ConsoleLogger } from '@/utils/logs'

import { ButtonBox, StyledFade, StyledVideo, VideoPoster, VideoWrapper } from './BackgroundVideoPlayer.styles'

type BackgroundVideoPlayerProps = {
  className?: string
  playing?: boolean
  handleActions?: boolean
  videoPlaytime?: number
  videoId?: string
  withFade?: boolean
  src: string[]
  poster: string[]
  customLink?: string
} & Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'poster'>

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
  videoId,
  withFade,
  customLink,
  ...props
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPosterVisible, setIsPosterVisible] = useState(true)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(true)
  const [canPlay, setCanPlay] = useState(false)

  const initialRender = useRef(true)
  useEffect(() => {
    // do this checking only once
    if (initialRender.current === false) return
    initialRender.current = false
    if (playing === false && autoPlay) {
      ConsoleLogger.warn(`BackgroundVideoPlayer: if "playing" prop is initially set to false, "autoPlay" won't work`)
    }
  }, [autoPlay, playing])

  const playVideo = useCallback(() => {
    if (videoRef.current && canPlay) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true)
          setIsPosterVisible(false)
        })
        .catch((error) => {
          ConsoleLogger.error('Failed to play video', error)
        })
    }
  }, [canPlay])

  const pauseVideo = useCallback(() => {
    if (videoRef.current && canPlay) {
      videoRef.current.pause()
      setIsPlaying(false)
      if (videoRef.current?.currentTime && videoRef.current.currentTime < 1) {
        setIsPosterVisible(true)
      }
    }
  }, [canPlay])

  useEffect(() => {
    // show poster again when src changes
    setIsPosterVisible(true)
    if (!videoRef.current || playing === undefined || !canPlay) {
      return
    }
    if (playing) {
      playVideo()
    } else {
      pauseVideo()
    }
  }, [canPlay, handleActions, pauseVideo, playVideo, playing, src])

  const handlePlay = (e: SyntheticEvent<HTMLVideoElement, Event>) => {
    setIsPlaying(true)
    onPlay?.(e)

    setIsPosterVisible(false)
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
      <StyledFade
        withFade={withFade}
        // to={customLink ? customLink : videoId ? absoluteRoutes.viewer.video(videoId) : ''}
      >
        <StyledVideo
          resolvedVideoUrls={src}
          autoPlay={autoPlay}
          playsInline={playsInline}
          ref={videoRef}
          onEnded={handleEnded}
          onPlay={handlePlay}
          onCanPlay={(event) => {
            setCanPlay(true)
            props.onCanPlay?.(event)
          }}
          resolvedPosterUrls={poster}
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
            <VideoPoster resolvedUrls={poster} type="cover" alt="" />
          </CSSTransition>
        )}
      </StyledFade>
    </VideoWrapper>
  )
}
