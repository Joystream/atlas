import { debounce, round } from 'lodash'
import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react'

import { VideoFieldsFragment } from '@/api/queries'
import { usePersonalDataStore } from '@/providers/personalData'
import {
  SvgPlayerFullScreen,
  SvgPlayerPause,
  SvgPlayerPip,
  SvgPlayerPipDisable,
  SvgPlayerPlay,
  SvgPlayerRestart,
  SvgPlayerSmallScreen,
  SvgPlayerSoundHalf,
  SvgPlayerSoundOn,
} from '@/shared/icons'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'
import { formatDurationShort } from '@/utils/time'

import { ControlsIndicator } from './ControlsIndicator'
import { CustomTimeline } from './CustomTimeline'
import { PlayerControlButton } from './PlayerControlButton'
import { VideoOverlay } from './VideoOverlay'
import {
  BigPlayButton,
  BigPlayButtonOverlay,
  Container,
  ControlsOverlay,
  CurrentTime,
  CurrentTimeWrapper,
  CustomControls,
  PlayButton,
  PlayControl,
  ScreenControls,
  StyledSvgPlayerSoundOff,
  VolumeButton,
  VolumeControl,
  VolumeSlider,
  VolumeSliderContainer,
} from './VideoPlayer.style'
import { CustomVideojsEvents, VOLUME_STEP, hotkeysHandler } from './utils'
import { VideoJsConfig, useVideoJsPlayer } from './videoJsPlayer'

export type VideoPlayerProps = {
  nextVideo?: VideoFieldsFragment | null
  className?: string
  videoStyle?: CSSProperties
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

export type PlayerState = 'loading' | 'ended' | 'error' | 'playing' | 'paused' | null

const VideoPlayerComponent: React.ForwardRefRenderFunction<HTMLVideoElement, VideoPlayerProps> = (
  { className, isInBackground, playing, nextVideo, channelId, videoId, autoplay, videoStyle, ...videoJsConfig },
  externalRef
) => {
  const [player, playerRef] = useVideoJsPlayer(videoJsConfig)
  const currentVolume = usePersonalDataStore((state) => state.currentVolume)
  const cachedVolume = usePersonalDataStore((state) => state.cachedVolume)
  const setCurrentVolume = usePersonalDataStore((state) => state.actions.setCurrentVolume)
  const setCachedVolume = usePersonalDataStore((state) => state.actions.setCachedVolume)
  const [volumeToSave, setVolumeToSave] = useState(0)

  const [videoTime, setVideoTime] = useState(0)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isPiPEnabled, setIsPiPEnabled] = useState(false)

  const [playerState, setPlayerState] = useState<PlayerState>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // handle hotkeys
  useEffect(() => {
    if (!player || isInBackground) {
      return
    }

    const handler = (event: KeyboardEvent) => {
      if (
        (document.activeElement?.tagName === 'BUTTON' && event.key === ' ') ||
        document.activeElement?.tagName === 'INPUT'
      ) {
        return
      }

      const playerReservedKeys = ['k', ' ', 'ArrowLeft', 'ArrowRight', 'j', 'l', 'ArrowUp', 'ArrowDown', 'm', 'f']
      if (playerReservedKeys.includes(event.key)) {
        event.preventDefault()
        hotkeysHandler(event, player, playerState)
      }
    }
    document.addEventListener('keydown', handler)

    return () => document.removeEventListener('keydown', handler)
  }, [isInBackground, player, playerState])

  // handle error
  useEffect(() => {
    if (!player) {
      return
    }
    const handler = () => {
      setPlayerState('error')
    }
    player.on('error', handler)
    return () => {
      player.off('error', handler)
    }
  })

  const playVideo = useCallback(() => {
    if (!player) {
      return
    }
    player.trigger(CustomVideojsEvents.PlayControl)
    const playPromise = player.play()
    if (playPromise) {
      playPromise
        .then(() => {
          setPlayerState('playing')
        })
        .catch((e) => {
          if (e.name === 'NotAllowedError') {
            ConsoleLogger.warn('Video playback failed', e)
          } else {
            SentryLogger.error('Video playback failed', 'VideoPlayer', e, {
              video: { id: videoId, url: videoJsConfig.src },
            })
          }
        })
    }
  }, [player, videoId, videoJsConfig.src])

  // handle video loading
  useEffect(() => {
    if (!player) {
      return
    }
    const handler = (event: Event) => {
      if (event.type === 'waiting' || event.type === 'seeking') {
        setPlayerState('loading')
      }
      if (event.type === 'canplaythrough' || event.type === 'seeked') {
        if (playerState !== null) {
          setPlayerState('playing')
        }
      }
    }
    player.on(['waiting', 'canplaythrough', 'seeking', 'seeked'], handler)
    return () => {
      player.off(['waiting', 'canplaythrough', 'seeking', 'seeked'], handler)
    }
  }, [player, playerState])

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
      setIsLoaded(true)
    }
    player.on('loadstart', handler)
    return () => {
      player.off('loadstart', handler)
    }
  }, [player])

  // handle autoplay
  useEffect(() => {
    if (!player || !isLoaded || !autoplay) {
      return
    }
    const playPromise = player.play()
    if (playPromise) {
      playPromise
        .then(() => {
          setPlayerState('playing')
        })
        .catch((e) => {
          ConsoleLogger.warn('Video autoplay failed', e)
        })
    }
  }, [player, isLoaded, autoplay])

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
      if (event.type === 'play' && playerState !== 'loading') {
        setPlayerState('playing')
      }
      if (event.type === 'pause' && playerState !== 'loading') {
        setPlayerState('paused')
      }
    }
    player.on(['play', 'pause'], handler)
    return () => {
      player.off(['play', 'pause'], handler)
    }
  }, [player, playerState])

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
    const handler = () => {
      const currentTime = round(player.currentTime())
      setVideoTime(currentTime)
    }
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
      if (playerState === 'ended') {
        playVideo()
      }
    }
    player.on('seeking', handler)
    return () => {
      player.off('seeking', handler)
    }
  }, [playVideo, player, playerState])

  // handle fullscreen mode
  useEffect(() => {
    if (!player) {
      return
    }
    const handler = () => {
      // will remove focus from fullscreen button and apply to player.
      player.focus()
      setIsFullScreen(player.isFullscreen())
    }
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
        if (currentVolume) {
          setCachedVolume(currentVolume)
        }
        setCurrentVolume(0)
        return
      }
      if (event.type === CustomVideojsEvents.Unmuted) {
        setCurrentVolume(cachedVolume || VOLUME_STEP)
        return
      }
      if (event.type === CustomVideojsEvents.VolumeIncrease || CustomVideojsEvents.VolumeDecrease) {
        setCurrentVolume(player.volume())
      }
    }
    player.on(events, handler)
    return () => {
      player.off(events, handler)
    }
  }, [currentVolume, player, cachedVolume, setCachedVolume, setCurrentVolume])

  const debouncedVolumeChange = useRef(
    debounce((volume: number) => {
      setVolumeToSave(volume)
    }, 125)
  )
  // update volume on mouse input
  useEffect(() => {
    if (!player || isInBackground) {
      return
    }
    player?.volume(currentVolume)

    debouncedVolumeChange.current(currentVolume)
    if (currentVolume) {
      player.muted(false)
    } else {
      if (volumeToSave) {
        setCachedVolume(volumeToSave)
      }
      player.muted(true)
    }
  }, [currentVolume, volumeToSave, isInBackground, player, setCachedVolume])

  // button/input handlers
  const handlePlayPause = () => {
    if (playerState === 'playing') {
      player?.pause()
      player?.trigger(CustomVideojsEvents.PauseControl)
    } else {
      playVideo()
    }
  }

  const handleChangeVolume = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentVolume(Number(event.target.value))
  }

  const handleMute = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (currentVolume === 0) {
      setCurrentVolume(cachedVolume || 0.05)
    } else {
      setCurrentVolume(0)
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
          ConsoleLogger.warn('Picture in picture failed', e)
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
    if (currentVolume === 0) {
      return <StyledSvgPlayerSoundOff />
    } else {
      return currentVolume <= 0.5 ? <SvgPlayerSoundHalf /> : <SvgPlayerSoundOn />
    }
  }

  const showBigPlayButton = playerState === null && !isInBackground
  const showPlayerControls = !isInBackground && isLoaded && playerState
  const showControlsIndicator = !isInBackground && playerState !== 'ended'

  return (
    <Container isFullScreen={isFullScreen} className={className} isInBackground={isInBackground}>
      <div data-vjs-player>
        {showBigPlayButton && (
          <BigPlayButtonOverlay onClick={handlePlayPause}>
            <BigPlayButton onClick={handlePlayPause}>
              <SvgPlayerPlay />
            </BigPlayButton>
          </BigPlayButtonOverlay>
        )}
        <video
          style={videoStyle}
          ref={playerRef}
          className="video-js"
          onClick={() =>
            player?.paused()
              ? player?.trigger(CustomVideojsEvents.PauseControl)
              : player?.trigger(CustomVideojsEvents.PlayControl)
          }
        />
        {showPlayerControls && (
          <>
            <ControlsOverlay isFullScreen={isFullScreen}>
              <CustomTimeline
                player={player}
                isFullScreen={isFullScreen}
                playerState={playerState}
                setPlayerState={setPlayerState}
              />
              <CustomControls isFullScreen={isFullScreen} isEnded={playerState === 'ended'}>
                <PlayControl isLoading={playerState === 'loading'}>
                  <PlayButton
                    isEnded={playerState === 'ended'}
                    onClick={handlePlayPause}
                    tooltipText={playerState === 'playing' ? 'Pause (k)' : 'Play (k)'}
                    tooltipPosition="left"
                  >
                    {playerState === 'ended' ? (
                      <SvgPlayerRestart />
                    ) : playerState === 'playing' ? (
                      <SvgPlayerPause />
                    ) : (
                      <SvgPlayerPlay />
                    )}
                  </PlayButton>
                </PlayControl>
                <VolumeControl>
                  <VolumeButton tooltipText="Volume" showTooltipOnlyOnFocus onClick={handleMute}>
                    {renderVolumeButton()}
                  </VolumeButton>
                  <VolumeSliderContainer>
                    <VolumeSlider
                      step={0.01}
                      max={1}
                      min={0}
                      value={currentVolume}
                      onChange={handleChangeVolume}
                      type="range"
                    />
                  </VolumeSliderContainer>
                </VolumeControl>
                <CurrentTimeWrapper>
                  <CurrentTime variant="body2">
                    {formatDurationShort(videoTime)} / {formatDurationShort(round(player?.duration() || 0))}
                  </CurrentTime>
                </CurrentTimeWrapper>
                <ScreenControls>
                  {isPiPSupported && (
                    <PlayerControlButton onClick={handlePictureInPicture} tooltipText="Picture-in-picture">
                      {isPiPEnabled ? <SvgPlayerPipDisable /> : <SvgPlayerPip />}
                    </PlayerControlButton>
                  )}
                  <PlayerControlButton
                    tooltipPosition="right"
                    tooltipText={isFullScreen ? 'Exit full screen (f)' : 'Full screen (f)'}
                    onClick={handleFullScreen}
                  >
                    {isFullScreen ? <SvgPlayerSmallScreen /> : <SvgPlayerFullScreen />}
                  </PlayerControlButton>
                </ScreenControls>
              </CustomControls>
            </ControlsOverlay>
            <VideoOverlay
              videoId={videoId}
              isFullScreen={isFullScreen}
              playerState={playerState}
              onPlay={handlePlayPause}
              channelId={channelId}
              currentThumbnailUrl={videoJsConfig.posterUrl}
            />
          </>
        )}
        {showControlsIndicator && <ControlsIndicator player={player} isLoading={playerState === 'loading'} />}
      </div>
    </Container>
  )
}

export const VideoPlayer = React.forwardRef(VideoPlayerComponent)
