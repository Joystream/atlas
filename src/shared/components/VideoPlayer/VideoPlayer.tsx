import { debounce, round } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { VideoFieldsFragment } from '@/api/queries'
import { usePersonalDataStore } from '@/providers'
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
import { Logger } from '@/utils/logger'
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

export type PlayerState = 'loading' | 'ended' | 'error' | 'playing' | null

const VideoPlayerComponent: React.ForwardRefRenderFunction<HTMLVideoElement, VideoPlayerProps> = (
  { className, isInBackground, playing, nextVideo, channelId, videoId, autoplay, ...videoJsConfig },
  externalRef
) => {
  const [player, playerRef] = useVideoJsPlayer(videoJsConfig)
  const currentVolume = usePersonalDataStore((state) => state.currentVolume)
  const cachedVolume = usePersonalDataStore((state) => state.cachedVolume)
  const setCurrentVolume = usePersonalDataStore((state) => state.actions.setCurrentVolume)
  const setCachedVolume = usePersonalDataStore((state) => state.actions.setCachedVolume)
  const [volumeToSave, setVolumeToSave] = useState(0)

  const [isPlaying, setIsPlaying] = useState(false)
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
        hotkeysHandler(event, player)
      }
    }
    document.addEventListener('keydown', handler)

    return () => document.removeEventListener('keydown', handler)
  }, [isInBackground, player])

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
        if (playerState !== null) {
          setPlayerState('playing')
        }
      }
    }
    player.on(['waiting', 'canplay'], handler)
    return () => {
      player.off(['waiting', 'canplay'], handler)
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
      playPromise.catch((e) => {
        Logger.warn('Autoplay failed:', e)
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
      if (event.type === 'play') {
        setIsPlaying(true)
        if (playerState !== 'loading') {
          setPlayerState('playing')
        }
      }
      if (event.type === 'pause') {
        setIsPlaying(false)
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
    if (isPlaying) {
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
    if (currentVolume === 0) {
      return <StyledSvgPlayerSoundOff />
    } else {
      return currentVolume <= 0.5 ? <SvgPlayerSoundHalf /> : <SvgPlayerSoundOn />
    }
  }

  const showBigPlayButton = playerState === null && !isInBackground
  const showPlayerControls = !isInBackground && isLoaded && playerState
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
              <CustomTimeline player={player} isFullScreen={isFullScreen} playerState={playerState} />
              <CustomControls isFullScreen={isFullScreen} isEnded={playerState === 'ended'}>
                <PlayerControlButton
                  onClick={handlePlayPause}
                  tooltipText={isPlaying ? 'Pause (k)' : 'Play (k)'}
                  tooltipPosition="left"
                >
                  {playerState === 'ended' ? <SvgPlayerRestart /> : isPlaying ? <SvgPlayerPause /> : <SvgPlayerPlay />}
                </PlayerControlButton>
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
              playerState={playerState}
              onPlay={handlePlayPause}
              channelId={channelId}
              currentThumbnailUrl={videoJsConfig.posterUrl}
            />
          </>
        )}
        {!isInBackground && <ControlsIndicator player={player} isLoading={playerState === 'loading'} />}
      </div>
    </Container>
  )
}

export const VideoPlayer = React.forwardRef(VideoPlayerComponent)
