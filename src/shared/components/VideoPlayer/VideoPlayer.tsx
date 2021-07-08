import { debounce } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { useCallback } from 'react'
import { CSSTransition } from 'react-transition-group'
import { VideoJsPlayer } from 'video.js'

import { usePersonalDataStore } from '@/providers'
import {
  SvgOutlineVideo,
  SvgPlayerBackwardFiveSec,
  SvgPlayerBackwardTenSec,
  SvgPlayerForwardFiveSec,
  SvgPlayerForwardTenSec,
  SvgPlayerFullScreen,
  SvgPlayerPause,
  SvgPlayerPip,
  SvgPlayerPipDisable,
  SvgPlayerPlay,
  SvgPlayerSmallScreen,
  SvgPlayerSoundHalf,
  SvgPlayerSoundOff,
  SvgPlayerSoundOn,
} from '@/shared/icons'
import { transitions } from '@/shared/theme'
import { Logger } from '@/utils/logger'
import { formatDurationShort } from '@/utils/time'

import {
  Container,
  ControlButton,
  ControlsIndicator,
  ControlsIndicatorTooltip,
  ControlsIndicatorWrapper,
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
import { CustomVideojsEvents, VOLUME_STEP, VideoJsConfig, useVideoJsPlayer } from './videoJsPlayer'

import { Text } from '../Text'

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

const isPiPSupported = 'pictureInPictureEnabled' in document
type VideoEvent = CustomVideojsEvents | 'play' | 'pause' | null

type EventState = {
  type: VideoEvent
  description: string | null
  icon: React.ReactNode | null
  isVisible: boolean
}

const VideoPlayerComponent: React.ForwardRefRenderFunction<HTMLVideoElement, VideoPlayerProps> = (
  { className, autoplay, isInBackground, playing, ...videoJsConfig },
  externalRef
) => {
  const [player, playerRef] = useVideoJsPlayer(videoJsConfig)
  const cachedPlayerVolume = usePersonalDataStore((state) => state.cachedPlayerVolume)
  const updateCachedPlayerVolume = usePersonalDataStore((state) => state.actions.updateCachedPlayerVolume)
  const [indicator, setIndicator] = useState<EventState | null>(null)

  useEffect(() => {
    if (!player || isInBackground) {
      return
    }
    const indicatorEvents = ['play', 'pause', ...Object.values(CustomVideojsEvents)]
    const handler = (e: Event) => {
      if (e.type === 'play' && !player.currentTime()) {
        return
      }
      const indicator = createIndicator(e.type as VideoEvent, player)
      if (indicator) {
        setIndicator({ ...indicator, isVisible: true })
      }
    }
    player.on(indicatorEvents, handler)

    return () => {
      player.off(indicatorEvents, handler)
    }
  }, [isInBackground, player])

  const [volume, setVolume] = useState(cachedPlayerVolume)
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoTime, setVideoTime] = useState(0)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isPiPEnabled, setIsPiPEnabled] = useState(false)
  const [playOverlayVisible, setPlayOverlayVisible] = useState(true)
  const [initialized, setInitialized] = useState(false)

  const displayPlayOverlay = playOverlayVisible && !isInBackground

  const playVideo = useCallback(() => {
    if (!player) {
      return
    }
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
  }, [player])

  // handle loading video
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

  // handle autoplay
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

  // handle playing and pausing from outside the component
  useEffect(() => {
    if (!player) {
      return
    }
    if (playing) {
      playVideo()
    } else {
      player.pause()
    }
  }, [playVideo, player, playing])

  // handle playing and pausing
  useEffect(() => {
    if (!player) {
      return
    }
    const handler = (event: Event) => {
      if (event.type === 'play') {
        setPlayOverlayVisible(false)
        setIsPlaying(true)
      }
      if (event.type === 'pause') {
        setIsPlaying(false)
      }
    }
    player.on(['play', 'pause'], handler)
    return () => {
      player.off(['play', 'pause'], handler)
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

  // handle video timer
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

  // handle fullscreen mode
  useEffect(() => {
    if (!player) {
      return
    }
    const handler = () => setIsFullScreen(player.isFullscreen())
    player.on('fullscreenchange', handler)
    return () => {
      player.off('fullscreenchange', handler)
    }
  }, [player])

  // handle picture in picture
  useEffect(() => {
    if (!player) {
      return
    }
    const handler = (event: Event) => {
      if (event.type === 'enterpictureinpicture') {
        setIsPiPEnabled(true)
      }
      if (event.type === 'leavepictureinpicture') {
        setIsPiPEnabled(false)
      }
    }
    player.on(['enterpictureinpicture', 'leavepictureinpicture'], handler)
    return () => {
      player.off(['enterpictureinpicture', 'leavepictureinpicture'], handler)
    }
  }, [player])

  // update volume on keyboard input
  useEffect(() => {
    if (!player) {
      return
    }

    const handler = (event: Event) => {
      if (event.type === 'mute') {
        setVolume(0)
        return
      }
      if (event.type === 'unmute') {
        setVolume(cachedPlayerVolume || VOLUME_STEP)
        return
      }
      if (event.type === 'volumechange') {
        setVolume(player.volume())
      }
    }
    player.on(['volumechange', 'mute', 'unmute'], handler)
    return () => {
      player.off(['volumechange', 'mute', 'unmute'], handler)
    }
  }, [cachedPlayerVolume, volume, player])

  const debouncedVolumeChange = useRef(
    debounce((volume: number) => {
      updateCachedPlayerVolume(volume)
    }, 125)
  )
  // update volume on mouse input
  useEffect(() => {
    if (!player || isInBackground) {
      return
    }
    player?.volume(volume)

    if (volume) {
      player.muted(false)
      debouncedVolumeChange.current(volume)
    } else {
      player.muted(true)
    }
  }, [isInBackground, player, volume])

  // button/input handlers
  const handlePlayPause = () => {
    isPlaying ? player?.pause() : playVideo()
  }

  const handleChangeVolume = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value))
  }

  const handleMute = (event: React.MouseEvent) => {
    event.stopPropagation()
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
        player.requestPictureInPicture().catch((e) => {
          Logger.warn('Picture in picture failed:', e)
        })
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

  return (
    <Container isFullScreen={isFullScreen} className={className} isInBackground={isInBackground}>
      {displayPlayOverlay && (
        <PlayOverlay onClick={handlePlayPause}>
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
                <VolumeSlider step={0.01} max={1} min={0} value={volume} onChange={handleChangeVolume} type="range" />
              </VolumeSliderContainer>
            </VolumeControl>
            <CurrentTime variant="body2">
              {formatDurationShort(videoTime)} / {formatDurationShort(Math.floor(player?.duration() || 0))}
            </CurrentTime>
            <ScreenControls>
              {isPiPSupported && (
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
        <CSSTransition
          in={indicator?.isVisible}
          timeout={parseInt(transitions.timings.loading)}
          classNames="indicator"
          mountOnEnter
          unmountOnExit
          onEntered={() => setIndicator((indicator) => (indicator ? { ...indicator, isVisible: false } : null))}
          onExited={() => setIndicator(null)}
        >
          <ControlsIndicatorWrapper>
            <ControlsIndicator>{indicator?.icon}</ControlsIndicator>
            <ControlsIndicatorTooltip>
              <Text variant="caption">{indicator?.description}</Text>
            </ControlsIndicatorTooltip>
          </ControlsIndicatorWrapper>
        </CSSTransition>
      </div>
    </Container>
  )
}

export const VideoPlayer = React.forwardRef(VideoPlayerComponent)

const createIndicator = (type: VideoEvent | null, player: VideoJsPlayer) => {
  const volume = Math.floor(player.volume() * 100) + '%'
  const isMuted = player.muted() || player.volume() === 0

  const volumeIcon = isMuted ? (
    <SvgPlayerSoundOff />
  ) : player.volume() >= 0.5 ? (
    <SvgPlayerSoundOn />
  ) : (
    <SvgPlayerSoundHalf />
  )

  switch (type) {
    case 'pause':
      return {
        icon: <SvgPlayerPause />,
        description: 'Pause',
        type,
      }
    case 'play':
      return {
        icon: <SvgPlayerPlay />,
        description: 'Play',
        type,
      }
    case CustomVideojsEvents.BackwardFiveSec:
      return {
        icon: <SvgPlayerBackwardFiveSec />,
        description: 'Backward 5 s',
        type,
      }
    case CustomVideojsEvents.ForwardFiveSec:
      return {
        icon: <SvgPlayerForwardFiveSec />,
        description: 'Forward 5s',
        type,
      }
    case CustomVideojsEvents.BackwardTenSec:
      return {
        icon: <SvgPlayerBackwardTenSec />,
        description: 'Backward 10s',
        type,
      }
    case CustomVideojsEvents.ForwardTenSec:
      return {
        icon: <SvgPlayerForwardTenSec />,
        description: 'Forward 10s',
        type,
      }
    case CustomVideojsEvents.Unmuted:
      return {
        icon: volumeIcon,
        description: volume,
        type,
      }
    case CustomVideojsEvents.Muted:
      return {
        icon: volumeIcon,
        description: 'Mute',
        type,
      }
    case CustomVideojsEvents.VolumeIncrease:
      return {
        icon: volumeIcon,
        description: volume,
        type,
      }
    case CustomVideojsEvents.VolumeDecrease:
      return {
        icon: volumeIcon,
        description: isMuted ? 'Mute' : volume,
        type,
      }
    default:
      return null
  }
}
