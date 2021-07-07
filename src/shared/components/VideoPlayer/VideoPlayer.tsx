import { debounce } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'

import { usePersonalDataStore } from '@/providers'
import {
  SvgOutlineVideo,
  SvgPlayerFullScreen,
  SvgPlayerPause,
  SvgPlayerPip,
  SvgPlayerPipDisable,
  SvgPlayerPlay,
  SvgPlayerSmallScreen,
  SvgPlayerSoundHalf,
  SvgPlayerSoundOn,
} from '@/shared/icons'
import { Logger } from '@/utils/logger'
import { formatDurationShort } from '@/utils/time'

import {
  Container,
  ControlButton,
  CurrentTime,
  CustomControls,
  PlayOverlay,
  ScreenControls,
  StyledSvgPlayerSoundOff,
  VolumeButton,
  VolumeControl,
  VolumeSlider,
  VolumeSliderContainer,
} from './VideoPlayer.style'
import { VideoJsConfig, useVideoJsPlayer } from './videoJsPlayer'

export type VideoPlayerProps = {
  className?: string
  autoplay?: boolean
  isInBackground?: boolean
  playing?: boolean
} & VideoJsConfig

declare global {
  interface Document {
    pictureInPictureEnabled: boolean
    pictureInPictureElement: Element
  }
}

const isPictureInPictureSupported = 'pictureInPictureEnabled' in document

const VideoPlayerComponent: React.ForwardRefRenderFunction<HTMLVideoElement, VideoPlayerProps> = (
  { className, autoplay, isInBackground, playing, ...videoJsConfig },
  externalRef
) => {
  const [player, playerRef] = useVideoJsPlayer(videoJsConfig)
  const cachedPlayerVolume = usePersonalDataStore((state) => state.cachedPlayerVolume)
  const updateCachedPlayerVolume = usePersonalDataStore((state) => state.actions.updateCachedPlayerVolume)

  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(cachedPlayerVolume)
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoTime, setVideoTime] = useState(0)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isPiPEnabled, setIsPiPEnabled] = useState(false)
  const [playOverlayVisible, setPlayOverlayVisible] = useState(true)
  const [initialized, setInitialized] = useState(false)

  const displayPlayOverlay = playOverlayVisible && !isInBackground

  useEffect(() => {
    if (volume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }, [volume])

  useEffect(() => {
    if (!player) {
      return
    }

    const handler = () => {
      setInitialized(true)
    }

    player.on('loadstart', handler)

    return () => {
      player.off('loadstart', handler)
    }
  }, [player])

  useEffect(() => {
    if (!player || !initialized || !autoplay) {
      return
    }

    const playPromise = player.play()
    if (playPromise) {
      playPromise.catch((e) => {
        Logger.warn('Autoplay failed:', e)
      })
    }
  }, [player, initialized, autoplay])

  useEffect(() => {
    if (!player) {
      return
    }

    if (playing != null) {
      if (playing) {
        const playPromise = player.play()
        if (playPromise) {
          playPromise.catch((e) => {
            if (e.name === 'NotAllowedError') {
              Logger.warn('Video play failed:', e)
            } else {
              Logger.error('Video play failed:', e)
            }
          })
        }
      } else {
        player.pause()
      }
    }
  }, [player, playing])

  useEffect(() => {
    if (!player) {
      return
    }

    const playHandler = () => {
      setPlayOverlayVisible(false)
      setIsPlaying(true)
    }

    const pauseHandler = () => {
      setIsPlaying(false)
    }

    player.on('play', playHandler)
    player.on('pause', pauseHandler)

    return () => {
      player.off('play', playHandler)
      player.off('pause', pauseHandler)
    }
  }, [player])

  useEffect(() => {
    if (!externalRef) {
      return
    }
    if (typeof externalRef === 'function') {
      externalRef(playerRef.current)
    } else {
      externalRef.current = playerRef.current
    }
  }, [externalRef, playerRef])

  const handlePlayOverlayClick = () => {
    if (!player) {
      return
    }
    player.play()
  }

  useEffect(() => {
    if (!player) {
      return
    }
    const handler = () => setVideoTime(Math.floor(player.currentTime()))

    player.on('timeupdate', handler)
    return () => {
      player.off('timeupdate', handler)
    }
  }, [player])

  useEffect(() => {
    if (!player) {
      return
    }
    const handler = () => {
      if (player.isFullscreen()) {
        setIsFullScreen(true)
      } else {
        setIsFullScreen(false)
      }
    }
    player.on('fullscreenchange', handler)
    return () => {
      player.off('fullscreenchange', handler)
    }
  }, [player])

  useEffect(() => {
    if (!player) {
      return
    }
    const handler = () => {
      if (player.isFullscreen()) {
        setIsFullScreen(true)
      } else {
        setIsFullScreen(false)
      }
    }
    player.on('fullscreenchange', handler)
    return () => {
      player.off('fullscreenchange', handler)
    }
  }, [player])

  useEffect(() => {
    if (!player) {
      return
    }
    const enterPiPhandler = () => {
      setIsPiPEnabled(true)
    }
    const exitPiPhandler = () => {
      setIsPiPEnabled(false)
    }

    player.on('enterpictureinpicture', enterPiPhandler)
    player.on('leavepictureinpicture', exitPiPhandler)
    return () => {
      player.off('enterpictureinpicture', enterPiPhandler)
      player.off('leavepictureinpicture', exitPiPhandler)
    }
  }, [player])

  const debouncedVolumeChange = useRef(
    debounce((volume: number) => {
      updateCachedPlayerVolume(volume)
    }, 500)
  )

  // update volume on keyboard input
  useEffect(() => {
    if (!player) {
      return
    }

    const handler = () => {
      setVolume(player.volume())
      if (player.volume()) {
        debouncedVolumeChange.current(player.volume())
      }
    }

    player.on('volumechange', handler)
    return () => {
      player.off('volumechange', handler)
    }
  }, [cachedPlayerVolume, player])

  // update volume on mouse input
  useEffect(() => {
    if (!player) {
      return
    }
    player?.volume(volume)

    if (volume) {
      debouncedVolumeChange.current(volume)
    }
  }, [isMuted, player, volume])

  const handleChangeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseInt(e.target.value) / 100
    setVolume(volume)
  }

  const handlePlayPause = () => (isPlaying ? player?.pause() : player?.play())

  const handleMute = () => {
    if (volume === 0) {
      setVolume(cachedPlayerVolume || 0.05)
    } else {
      setVolume(0)
    }
  }

  const handlePictureInPicture = () => {
    if (document.pictureInPictureElement) {
      // @ts-ignore @types/video.js is outdated and doesn't provide types for some newer video.js features
      player.exitPictureInPicture()
    } else {
      if (document.pictureInPictureEnabled) {
        // @ts-ignore @types/video.js is outdated and doesn't provide types for some newer video.js features
        player.requestPictureInPicture()
      }
    }
  }

  const handleFullScreen = () => {
    if (player?.isFullscreen()) {
      player?.exitFullscreen()
    } else {
      player?.requestFullscreen()
    }
  }

  const renderVolumeButton = () => {
    if (volume === 0) {
      return <StyledSvgPlayerSoundOff />
    } else {
      return volume <= 0.5 ? <SvgPlayerSoundHalf /> : <SvgPlayerSoundOn />
    }
  }

  const volumeSlider = useRef(null)
  return (
    <Container isFullScreen={isFullScreen} className={className} isInBackground={isInBackground}>
      {displayPlayOverlay && (
        <PlayOverlay onClick={handlePlayOverlayClick}>
          <SvgOutlineVideo width={72} height={72} viewBox="0 0 24 24" />
        </PlayOverlay>
      )}
      <div data-vjs-player>
        <video ref={playerRef} className="video-js" />
        {!isInBackground && !playOverlayVisible && (
          <CustomControls isFullScreen={isFullScreen}>
            <ControlButton onClick={handlePlayPause}>
              {isPlaying ? <SvgPlayerPause /> : <SvgPlayerPlay />}
            </ControlButton>
            <VolumeControl>
              <VolumeButton onClick={handleMute}>{renderVolumeButton()}</VolumeButton>
              <VolumeSliderContainer>
                <VolumeSlider
                  ref={volumeSlider}
                  step={1}
                  max={100}
                  min={0}
                  value={volume * 100}
                  onChange={handleChangeVolume}
                  type="range"
                />
              </VolumeSliderContainer>
            </VolumeControl>
            <CurrentTime variant="body2">
              {formatDurationShort(videoTime)} / {formatDurationShort(Math.floor(player?.duration() || 0))}
            </CurrentTime>
            <ScreenControls>
              {isPictureInPictureSupported && (
                <ControlButton onClick={handlePictureInPicture}>
                  {isPiPEnabled ? <SvgPlayerPipDisable /> : <SvgPlayerPip />}
                </ControlButton>
              )}
              <ControlButton onClick={handleFullScreen}>
                {isFullScreen ? <SvgPlayerSmallScreen /> : <SvgPlayerFullScreen />}
              </ControlButton>
            </ScreenControls>
          </CustomControls>
        )}
      </div>
    </Container>
  )
}

export const VideoPlayer = React.forwardRef(VideoPlayerComponent)
