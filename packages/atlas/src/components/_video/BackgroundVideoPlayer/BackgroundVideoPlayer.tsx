import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { FC, SyntheticEvent, VideoHTMLAttributes, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import { SvgActionPause, SvgActionPlay, SvgActionSoundOff, SvgActionSoundOn } from '@/assets/icons'
import { Button } from '@/components/_buttons/Button'
import { VideoProgress } from '@/components/_video/BackgroundVideoPlayer/VideoProgress'
import { absoluteRoutes } from '@/config/routes'
import { cVar, media, sizes, transitions, zIndex } from '@/styles'
import { ConsoleLogger } from '@/utils/logs'

type BackgroundVideoPlayerProps = {
  className?: string
  playing?: boolean
  handleActions?: boolean
  videoPlaytime?: number
  videoId?: string
  withFade?: boolean
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
  videoId,
  withFade,
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
      <StyledLink withFade={withFade} to={videoId ? absoluteRoutes.viewer.video(videoId) : ''}>
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
      </StyledLink>
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

// on Firefox there is a gap between fades, negative margin fixes that
export const StyledLink = styled(Link)<{ withFade?: boolean }>`
  ::after {
    ${media.sm} {
      content: '';
      position: absolute;
      inset: 50% 0 0 0;
      margin: 0 0 -2px;

      ${(props) =>
        props.withFade &&
        css`
          background: linear-gradient(
            180deg,
            rgb(7 8 8 / 0) 0%,
            rgb(7 8 8 / 0.0071) 11.79%,
            rgb(7 8 8 / 0.0276) 21.38%,
            rgb(7 8 8 / 0.0598) 29.12%,
            rgb(7 8 8 / 0.1026) 35.34%,
            rgb(7 8 8 / 0.1543) 40.37%,
            rgb(7 8 8 / 0.2135) 44.56%,
            rgb(7 8 8 / 0.2789) 48.24%,
            rgb(7 8 8 / 0.349) 51.76%,
            rgb(7 8 8 / 0.4222) 55.44%,
            rgb(7 8 8 / 0.4974) 59.63%,
            rgb(7 8 8 / 0.5729) 64.66%,
            rgb(7 8 8 / 0.6474) 70.88%,
            rgb(7 8 8 / 0.7193) 78.62%,
            rgb(7 8 8 / 0.7873) 88.21%,
            rgb(7 8 8 / 0.85) 100%
          );
          border-bottom: 32px solid ${cVar('colorCoreNeutral700Darken')};
        `}
    }
  }
`
