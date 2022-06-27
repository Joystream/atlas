import { debounce, round } from 'lodash-es'
import {
  CSSProperties,
  ChangeEvent,
  ForwardRefRenderFunction,
  MouseEvent,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import useResizeObserver from 'use-resize-observer'
import { VideoJsPlayer } from 'video.js'

import { FullVideoFieldsFragment } from '@/api/queries'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { usePersonalDataStore } from '@/providers/personalData'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'
import { formatDurationShort } from '@/utils/time'

import { ControlsIndicator } from './ControlsIndicator'
import { CustomTimeline } from './CustomTimeline'
import { PlayerControlButton } from './PlayerControlButton'
import { SettingsButtonWithPopover } from './SettingsButtonWithPopover'
import { VideoOverlay } from './VideoOverlay'
import {
  BigPlayButton,
  BigPlayButtonContainer,
  Container,
  ControlsOverlay,
  CurrentTime,
  CurrentTimeWrapper,
  CustomControls,
  PlayButton,
  PlayControl,
  ScreenControls,
  StyledSvgControlsFullScreen,
  StyledSvgControlsPause,
  StyledSvgControlsPipOff,
  StyledSvgControlsPipOn,
  StyledSvgControlsPlay,
  StyledSvgControlsReplay,
  StyledSvgControlsSmallScreen,
  StyledSvgControlsSoundLowVolume,
  StyledSvgControlsVideoModeCinemaView,
  StyledSvgControlsVideoModeCompactView,
  StyledSvgPlayerSoundOff,
  StyledSvgPlayerSoundOn,
  VolumeButton,
  VolumeControl,
  VolumeSlider,
  VolumeSliderContainer,
} from './VideoPlayer.styles'
import { CustomVideojsEvents, PlayerState, VOLUME_STEP, hotkeysHandler, isFullScreenEnabled } from './utils'
import { VideoJsConfig, useVideoJsPlayer } from './videoJsPlayer'

export type VideoPlayerProps = {
  isVideoPending?: boolean
  nextVideo?: FullVideoFieldsFragment | null
  className?: string
  videoStyle?: CSSProperties
  autoplay?: boolean
  playing?: boolean
  channelId?: string
  videoId?: string
  isEmbedded?: boolean
  isPlayNextDisabled?: boolean
} & VideoJsConfig

declare global {
  interface Document {
    readonly pictureInPictureEnabled: boolean
    readonly webkitFullscreenEnabled: boolean
    readonly mozFullScreenEnabled: boolean
    readonly msFullscreenEnabled: boolean
    readonly pictureInPictureElement: Element
  }
}

const isPiPSupported = 'pictureInPictureEnabled' in document

const VideoPlayerComponent: ForwardRefRenderFunction<HTMLVideoElement, VideoPlayerProps> = (
  {
    isVideoPending,
    className,
    playing,
    nextVideo,
    channelId,
    videoId,
    autoplay,
    videoStyle,
    isEmbedded,
    isPlayNextDisabled,
    ...videoJsConfig
  },
  externalRef
) => {
  const [player, playerRef] = useVideoJsPlayer(videoJsConfig)
  const [isPlaying, setIsPlaying] = useState(false)
  const { height: playerHeight = 0 } = useResizeObserver({ box: 'border-box', ref: playerRef })
  const customControlsRef = useRef<HTMLDivElement>(null)

  const customControlsOffset =
    ((customControlsRef.current?.getBoundingClientRect().top || 0) -
      (playerRef.current?.getBoundingClientRect().bottom || 0)) *
    -1

  const playerHeightWithoutCustomControls = playerHeight - customControlsOffset

  const {
    currentVolume,
    cachedVolume,
    cinematicView,
    playbackRate,
    autoPlayNext,
    actions: { setCurrentVolume, setCachedVolume, setCinematicView },
  } = usePersonalDataStore((state) => state)
  const [volumeToSave, setVolumeToSave] = useState(0)

  const [videoTime, setVideoTime] = useState(0)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isPiPEnabled, setIsPiPEnabled] = useState(false)
  const [isSettingsPopoverOpened, setIsSettingsPopoverOpened] = useState(false)

  const [playerState, setPlayerState] = useState<PlayerState>('loading')
  const [isLoaded, setIsLoaded] = useState(false)
  const [needsManualPlay, setNeedsManualPlay] = useState(!autoplay)
  const mdMatch = useMediaMatch('md')

  const playVideo = useCallback(
    async (player: VideoJsPlayer | null, withIndicator?: boolean, callback?: () => void) => {
      if (!player) {
        return
      }
      withIndicator && player.trigger(CustomVideojsEvents.PlayControl)
      try {
        setNeedsManualPlay(false)
        const playPromise = await player.play()
        if (playPromise && callback) callback()
      } catch (error) {
        if (error.name === 'AbortError') {
          // this will prevent throwing harmless error `the play() request was interrupted by a call to pause()`
          // Video.js doing something similiar, check:
          // https://github.com/videojs/video.js/issues/6998
          // https://github.com/videojs/video.js/blob/4238f5c1d88890547153e7e1de7bd0d1d8e0b236/src/js/utils/promise.js
          return
        }
        if (error.name === 'NotAllowedError') {
          ConsoleLogger.warn('Video playback failed', error)
        } else {
          SentryLogger.error('Video playback failed', 'VideoPlayer', error, {
            video: { id: videoId, url: videoJsConfig.src },
          })
        }
      }
    },
    [videoId, videoJsConfig.src]
  )

  const pauseVideo = useCallback((player: VideoJsPlayer | null, withIndicator?: boolean, callback?: () => void) => {
    if (!player) {
      return
    }
    withIndicator && player.trigger(CustomVideojsEvents.PauseControl)
    callback?.()
    player.pause()
  }, [])

  useEffect(() => {
    if (!isVideoPending) {
      return
    }
    setPlayerState('pending')
  }, [isVideoPending])

  // handle hotkeys
  useEffect(() => {
    if (!player) {
      return
    }

    const handler = (event: KeyboardEvent) => {
      if (
        (document.activeElement?.tagName === 'BUTTON' && event.key === ' ') ||
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return
      }

      const playerReservedKeys = ['k', ' ', 'ArrowLeft', 'ArrowRight', 'j', 'l', 'ArrowUp', 'ArrowDown', 'm', 'f', 'c']
      if (
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey &&
        playerReservedKeys.includes(event.key)
      ) {
        event.preventDefault()
        hotkeysHandler(event, player, playVideo, pauseVideo, () => setCinematicView(!cinematicView))
      }
    }
    document.addEventListener('keydown', handler)

    return () => document.removeEventListener('keydown', handler)
  }, [cinematicView, pauseVideo, playVideo, player, playerState, setCinematicView])

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

  // handle setting playback rate
  useEffect(() => {
    if (!player) {
      return
    }
    // we need to set both - playbackRate and defaultPlaybackRate to make this persistent
    player.playbackRate(playbackRate)
    player.defaultPlaybackRate(playbackRate)
  }, [playbackRate, player])

  // handle video loading
  useEffect(() => {
    if (!player) {
      return
    }
    const handler = (event: Event) => {
      if (event.type === 'waiting' || event.type === 'seeking') {
        setPlayerState('loading')
      }
      if (event.type === 'canplay' || event.type === 'seeked') {
        setPlayerState('playingOrPaused')
      }
    }
    player.on(['waiting', 'canplay', 'seeking', 'seeked'], handler)
    return () => {
      player.off(['waiting', 'canplay', 'seeking', 'seeked'], handler)
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
          setIsPlaying(true)
        })
        .catch((e) => {
          setNeedsManualPlay(true)
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
      playVideo(player)
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
        playVideo(player)
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
    if (!player) {
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
  }, [currentVolume, volumeToSave, player, setCachedVolume])

  // button/input handlers
  const handlePlayPause = useCallback(() => {
    if (playerState === 'error') {
      return
    }
    if (isPlaying) {
      pauseVideo(player, true, () => setIsPlaying(false))
    } else {
      playVideo(player, true, () => setIsPlaying(true))
    }
  }, [isPlaying, pauseVideo, playVideo, player, playerState])

  const handleChangeVolume = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentVolume(Number(event.target.value))
  }

  const handleMute = () => {
    if (currentVolume === 0) {
      setCurrentVolume(cachedVolume || 0.05)
    } else {
      setCurrentVolume(0)
    }
  }

  const handlePictureInPicture = (event: MouseEvent) => {
    event.stopPropagation()
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

  const handleFullScreen = (event: MouseEvent) => {
    event.stopPropagation()
    if (!isFullScreenEnabled) {
      return
    }
    if (player?.isFullscreen()) {
      player?.exitFullscreen()
    } else {
      player?.requestFullscreen()
    }
  }

  const onVideoClick = useCallback(
    () =>
      player?.paused()
        ? player?.trigger(CustomVideojsEvents.PauseControl)
        : player?.trigger(CustomVideojsEvents.PlayControl),
    [player]
  )

  const renderVolumeButton = () => {
    if (currentVolume === 0) {
      return <StyledSvgPlayerSoundOff />
    } else {
      return currentVolume <= 0.5 ? <StyledSvgControlsSoundLowVolume /> : <StyledSvgPlayerSoundOn />
    }
  }

  const toggleCinematicView = (event: MouseEvent) => {
    event.stopPropagation()
    setCinematicView(!cinematicView)
  }

  const showPlayerControls = isLoaded && playerState
  const showControlsIndicator = playerState !== 'ended'

  return (
    <Container isFullScreen={isFullScreen} className={className} isSettingsPopoverOpened={isSettingsPopoverOpened}>
      <div data-vjs-player onClick={handlePlayPause}>
        {needsManualPlay && (
          <BigPlayButtonContainer onClick={handlePlayPause}>
            <BigPlayButton onClick={handlePlayPause}>
              <StyledSvgControlsPlay />
            </BigPlayButton>
          </BigPlayButtonContainer>
        )}
        <video style={videoStyle} ref={playerRef} className="video-js" onClick={onVideoClick} />
        {showPlayerControls && (
          <>
            <ControlsOverlay isSettingsPopoverOpened={isSettingsPopoverOpened} isFullScreen={isFullScreen}>
              <CustomTimeline
                playVideo={playVideo}
                pauseVideo={pauseVideo}
                player={player}
                isFullScreen={isFullScreen}
                playerState={playerState}
                setPlayerState={setPlayerState}
              />
              <CustomControls
                isFullScreen={isFullScreen}
                isEnded={playerState === 'ended'}
                ref={customControlsRef}
                isSettingsPopoverOpened={isSettingsPopoverOpened}
              >
                <PlayControl isLoading={playerState === 'loading'}>
                  {(!needsManualPlay || mdMatch) && (
                    <PlayButton
                      isEnded={playerState === 'ended'}
                      onClick={handlePlayPause}
                      tooltipText={isPlaying ? 'Pause (k)' : playerState === 'ended' ? 'Play again (k)' : 'Play (k)'}
                      tooltipPosition="left"
                    >
                      {playerState === 'ended' ? (
                        <StyledSvgControlsReplay />
                      ) : isPlaying ? (
                        <StyledSvgControlsPause />
                      ) : (
                        <StyledSvgControlsPlay />
                      )}
                    </PlayButton>
                  )}
                </PlayControl>
                <VolumeControl onClick={(e) => e.stopPropagation()}>
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
                  <CurrentTime as="span" variant="t200">
                    {formatDurationShort(videoTime)} / {formatDurationShort(round(player?.duration() || 0))}
                  </CurrentTime>
                </CurrentTimeWrapper>
                <ScreenControls>
                  {mdMatch && !isEmbedded && !player?.isFullscreen() && (
                    <PlayerControlButton
                      tooltipEnabled={!isSettingsPopoverOpened}
                      onClick={toggleCinematicView}
                      tooltipText={cinematicView ? 'Exit cinematic mode (c)' : 'Cinematic view (c)'}
                    >
                      {cinematicView ? (
                        <StyledSvgControlsVideoModeCompactView />
                      ) : (
                        <StyledSvgControlsVideoModeCinemaView />
                      )}
                    </PlayerControlButton>
                  )}
                  {isPiPSupported && (
                    <PlayerControlButton
                      onClick={handlePictureInPicture}
                      tooltipText="Picture-in-picture"
                      tooltipEnabled={!isSettingsPopoverOpened}
                    >
                      {isPiPEnabled ? <StyledSvgControlsPipOff /> : <StyledSvgControlsPipOn />}
                    </PlayerControlButton>
                  )}
                  <SettingsButtonWithPopover
                    onSettingsPopoverToggle={setIsSettingsPopoverOpened}
                    isSettingsPopoverOpened={isSettingsPopoverOpened}
                    playerHeightWithoutCustomControls={playerHeightWithoutCustomControls}
                    boundariesElement={playerRef.current}
                    isFullScreen={isFullScreen}
                  />
                  <PlayerControlButton
                    isDisabled={!isFullScreenEnabled}
                    tooltipEnabled={!isSettingsPopoverOpened}
                    tooltipPosition="right"
                    tooltipText={isFullScreen ? 'Exit full screen (f)' : 'Full screen (f)'}
                    onClick={handleFullScreen}
                  >
                    {isFullScreen ? <StyledSvgControlsSmallScreen /> : <StyledSvgControlsFullScreen />}
                  </PlayerControlButton>
                </ScreenControls>
              </CustomControls>
            </ControlsOverlay>
          </>
        )}
        <VideoOverlay
          videoId={videoId}
          isFullScreen={isFullScreen}
          isPlayNextDisabled={isPlayNextDisabled || !autoPlayNext}
          playerState={playerState}
          onPlay={handlePlayPause}
          channelId={channelId}
          currentThumbnailUrl={videoJsConfig.posterUrl}
          playRandomVideoOnEnded={!isEmbedded}
        />
        {showControlsIndicator && <ControlsIndicator player={player} isLoading={playerState === 'loading'} />}
      </div>
    </Container>
  )
}

export const VideoPlayer = forwardRef(VideoPlayerComponent)
