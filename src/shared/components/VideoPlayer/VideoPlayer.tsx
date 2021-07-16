import { debounce } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { VideoFieldsFragment } from '@/api/queries'
import { usePersonalDataStore } from '@/providers'
import {
  SvgPlayerBackwardFiveSec,
  SvgPlayerBackwardTenSec,
  SvgPlayerForwardFiveSec,
  SvgPlayerForwardTenSec,
  SvgPlayerFullScreen,
  SvgPlayerPause,
  SvgPlayerPip,
  SvgPlayerPipDisable,
  SvgPlayerPlay,
  SvgPlayerRestart,
  SvgPlayerSmallScreen,
  SvgPlayerSoundHalf,
  SvgPlayerSoundOff,
  SvgPlayerSoundOn,
} from '@/shared/icons'
import { Logger } from '@/utils/logger'
import { formatDurationShort } from '@/utils/time'

import { EndingOverlay, PlayerState } from './EndingOverlay'
import { ErrorOverlay } from './ErrorOverlay'
import { LoadingOverlay } from './LoadingOverlay'
import {
  BigPlayButton,
  BigPlayButtonOverlay,
  Container,
  ControlButton,
  ControlsIndicator,
  ControlsIndicatorTooltip,
  ControlsIndicatorWrapper,
  ControlsOverlay,
  CurrentTime,
  CurrentTimeWrapper,
  CustomControls,
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
  nextVideo?: VideoFieldsFragment | null
  className?: string
  autoplay?: boolean
  isInBackground?: boolean
  playing?: boolean
  channelId?: string
  videoId?: string
} & VideoJsConfig

declare global {
  interface Document {
    pictureInPictureEnabled: boolean
    pictureInPictureElement: Element
  }
}

const isPiPSupported = 'pictureInPictureEnabled' in document
type VideoEvent = CustomVideojsEvents | null

type EventState = {
  type: VideoEvent
  description: string | null
  icon: React.ReactNode | null
  isVisible: boolean
}

const VideoPlayerComponent: React.ForwardRefRenderFunction<HTMLVideoElement, VideoPlayerProps> = (
  { className, isInBackground, playing, nextVideo, channelId, videoId, autoplay, ...videoJsConfig },
  externalRef
) => {
  const [player, playerRef] = useVideoJsPlayer({ ...videoJsConfig })
  const cachedPlayerVolume = usePersonalDataStore((state) => state.cachedPlayerVolume)
  const updateCachedPlayerVolume = usePersonalDataStore((state) => state.actions.updateCachedPlayerVolume)
  const [indicator, setIndicator] = useState<EventState | null>(null)

  const [volume, setVolume] = useState(cachedPlayerVolume)
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoTime, setVideoTime] = useState(0)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isPiPEnabled, setIsPiPEnabled] = useState(false)

  const [playerState, setPlayerState] = useState<PlayerState>('not-initialized')
  const [playerError, setPlayerError] = useState<MediaError | null>(null)
  const [bigPlayButtonVisible, setIsBigPlayButtonVisible] = useState(true)
  const [initialized, setInitialized] = useState(false)

  // handle error
  useEffect(() => {
    if (!player) {
      return
    }
    const handler = () => {
      setPlayerError(player.error())
    }
    player.on('error', handler)
    return () => {
      player.off('error', handler)
    }
  })

  // handle showing player indicators
  useEffect(() => {
    if (!player || isInBackground) {
      return
    }
    const indicatorEvents = Object.values(CustomVideojsEvents)
    const handler = (e: Event) => {
      const playerVolume = e.type === CustomVideojsEvents.Unmuted ? cachedPlayerVolume || VOLUME_STEP : player.volume()
      const indicator = createIndicator(e.type as VideoEvent, playerVolume, player.muted())
      if (indicator) {
        setIndicator({ ...indicator, isVisible: true })
      }
    }
    player.on(indicatorEvents, handler)

    return () => {
      player.off(indicatorEvents, handler)
    }
  }, [cachedPlayerVolume, isInBackground, player])

  const playVideo = useCallback(() => {
    if (!player) {
      return
    }
    player.trigger(CustomVideojsEvents.PlayControl)
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

  // handle video loading
  useEffect(() => {
    if (!player) {
      return
    }
    const handler = (event: Event) => {
      if (event.type === 'waiting') {
        setPlayerState('loading')
      }
      if (event.type === 'canplay') {
        setPlayerState(null)
      }
    }
    player.on(['waiting', 'canplay'], handler)
    return () => {
      player.off(['waiting', 'canplay'], handler)
    }
  }, [nextVideo, player])

  useEffect(() => {
    if (!player) {
      return
    }
    const handler = () => {
      setPlayerState('ended')
    }
    player.on('ended', handler)
    return () => {
      player.off('ended', handler)
    }
  }, [nextVideo, player])

  // handle loadstart
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
        setIsBigPlayButtonVisible(false)
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

  // handle seeking
  useEffect(() => {
    if (!player) {
      return
    }
    const handler = () => {
      setPlayerState(null)
      if (playerState === 'ended') {
        player.play()
      }
    }
    player.on('seeking', handler)
    return () => {
      player.off('seeking', handler)
    }
  }, [player, playerState])

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
    const events = [
      CustomVideojsEvents.VolumeIncrease,
      CustomVideojsEvents.VolumeDecrease,
      CustomVideojsEvents.Muted,
      CustomVideojsEvents.Unmuted,
    ]

    const handler = (event: Event) => {
      if (event.type === CustomVideojsEvents.Muted) {
        setVolume(0)
        return
      }
      if (event.type === CustomVideojsEvents.Unmuted) {
        setVolume(cachedPlayerVolume || VOLUME_STEP)
        return
      }
      if (event.type === CustomVideojsEvents.VolumeIncrease || CustomVideojsEvents.VolumeDecrease) {
        setVolume(player.volume())
      }
    }
    player.on(events, handler)
    return () => {
      player.off(events, handler)
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
    if (isPlaying) {
      player?.pause()
      player?.trigger(CustomVideojsEvents.PauseControl)
    } else {
      playVideo()
    }
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
      <div data-vjs-player>
        <video ref={playerRef} className="video-js" />
        {!isInBackground && initialized && (
          <>
            {!bigPlayButtonVisible && (
              <>
                <ControlsOverlay isFullScreen={isFullScreen} />
                <CustomControls isFullScreen={isFullScreen} isEnded={playerState === 'ended'}>
                  <ControlButton onClick={handlePlayPause}>
                    {playerState === 'ended' ? (
                      <SvgPlayerRestart />
                    ) : isPlaying ? (
                      <SvgPlayerPause />
                    ) : (
                      <SvgPlayerPlay />
                    )}
                  </ControlButton>
                  <VolumeControl>
                    <VolumeButton onClick={handleMute}>{renderVolumeButton()}</VolumeButton>
                    <VolumeSliderContainer>
                      <VolumeSlider
                        step={0.01}
                        max={1}
                        min={0}
                        value={volume}
                        onChange={handleChangeVolume}
                        type="range"
                      />
                    </VolumeSliderContainer>
                  </VolumeControl>
                  <CurrentTimeWrapper>
                    <CurrentTime variant="body2">
                      {formatDurationShort(videoTime)} / {formatDurationShort(Math.floor(player?.duration() || 0))}
                    </CurrentTime>
                  </CurrentTimeWrapper>
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
              </>
            )}
            {bigPlayButtonVisible && !isInBackground && (
              <BigPlayButtonOverlay>
                <BigPlayButton onClick={handlePlayPause}>
                  <SvgPlayerPlay />
                </BigPlayButton>
              </BigPlayButtonOverlay>
            )}
            {playerState === 'loading' && <LoadingOverlay />}
            <EndingOverlay
              currentThumbnail={videoJsConfig.posterUrl}
              isEnded={playerState === 'ended'}
              channelId={channelId}
              onPlayAgain={handlePlayPause}
              isFullScreen={isFullScreen}
            />
          </>
        )}
        <CSSTransition
          in={indicator?.isVisible}
          timeout={indicator?.isVisible ? 0 : 750}
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
      {playerError && <ErrorOverlay />}
    </Container>
  )
}

export const VideoPlayer = React.forwardRef(VideoPlayerComponent)

const createIndicator = (type: VideoEvent | null, playerVolume: number, playerMuted: boolean) => {
  const formattedVolume = Math.floor(playerVolume * 100) + '%'
  const isMuted = playerMuted || !Number(playerVolume.toFixed(2))

  switch (type) {
    case CustomVideojsEvents.PauseControl:
      return {
        icon: <SvgPlayerPause />,
        description: 'Pause',
        type,
      }
    case CustomVideojsEvents.PlayControl:
      return {
        icon: <SvgPlayerPlay />,
        description: 'Play',
        type,
      }
    case CustomVideojsEvents.BackwardFiveSec:
      return {
        icon: <SvgPlayerBackwardFiveSec />,
        description: 'Backward 5s',
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
        icon: <SvgPlayerSoundOn />,
        description: formattedVolume,
        type,
      }
    case CustomVideojsEvents.Muted:
      return {
        icon: <SvgPlayerSoundOff />,
        description: 'Mute',
        type,
      }
    case CustomVideojsEvents.VolumeIncrease:
      return {
        icon: <SvgPlayerSoundOn />,
        description: formattedVolume,
        type,
      }
    case CustomVideojsEvents.VolumeDecrease:
      return {
        icon: isMuted ? <SvgPlayerSoundOff /> : <SvgPlayerSoundHalf />,
        description: isMuted ? 'Mute' : formattedVolume,
        type,
      }
    default:
      return null
  }
}
