import { debounce, round } from 'lodash-es'
import {
  CSSProperties,
  ChangeEvent,
  ForwardRefRenderFunction,
  MouseEvent,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import useResizeObserver from 'use-resize-observer'
import { VideoJsPlayer } from 'video.js'

import { useFullVideo } from '@/api/hooks/video'
import { FullVideoFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgActionClose, SvgControlsCaptionsOutline, SvgControlsCaptionsSolid } from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSegmentAnalytics, videoPlaybackParams } from '@/hooks/useSegmentAnalytics'
import { usePersonalDataStore } from '@/providers/personalData'
import { isMobile } from '@/utils/browser'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'
import { formatDurationShort } from '@/utils/time'

import { ControlsIndicator } from './ControlsIndicator'
import { CustomTimeline } from './CustomTimeline'
import { PlayerControlButton } from './PlayerControlButton'
import { AvailableTrack, SettingsButtonWithPopover } from './SettingsButtonWithPopover'
import { VideoOverlay } from './VideoOverlay'
import {
  BigPlayButton,
  BigPlayButtonContainer,
  Container,
  ControlsOverlay,
  CurrentTime,
  CurrentTimeWrapper,
  CustomControls,
  EmbbeddedTopBarOverlay,
  MinimizedPlayerContorols,
  PlayButton,
  PlayControl,
  ScreenControls,
  StyledAppLogoFullMonochrome,
  StyledAppLogoShortMonochrome,
  StyledEmbeddedLogoLink,
  StyledSvgControlsFullScreen,
  StyledSvgControlsPause,
  StyledSvgControlsPipOff,
  StyledSvgControlsPipOn,
  StyledSvgControlsPlay,
  StyledSvgControlsReplay,
  StyledSvgControlsShare,
  StyledSvgControlsSmallScreen,
  StyledSvgControlsSoundLowVolume,
  StyledSvgControlsVideoModeCinemaView,
  StyledSvgControlsVideoModeCompactView,
  StyledSvgPlayerSoundOff,
  StyledSvgPlayerSoundOn,
  StyledText,
  TitleContainer,
  VolumeButton,
  VolumeControl,
  VolumeSlider,
  VolumeSliderContainer,
} from './VideoPlayer.styles'
import { VideoShare } from './VideoShare'
import { CustomVideojsEvents, PlayerState, VOLUME_STEP, hotkeysHandler, isFullScreenEnabled } from './utils'
import { VideoJsConfig, useVideoJsPlayer } from './videoJsPlayer'

export type VideoPlayerProps = {
  channelAvatarUrls?: string[] | null
  isChannelAvatarLoading?: boolean
  isShareDialogOpen?: boolean
  onCloseShareDialog?: () => void
  onAddVideoView?: () => void
  isVideoPending?: boolean
  nextVideo?: FullVideoFieldsFragment | null
  className?: string
  videoStyle?: CSSProperties
  onError?: () => void
  autoplay?: boolean
  playing?: boolean
  videoId?: string
  isEmbedded?: boolean
  isPlayNextDisabled?: boolean
  availableTextTracks?: AvailableTrack[]
  isMinimized?: boolean
  onMinimizedExit?: () => void
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
    channelAvatarUrls,
    isChannelAvatarLoading,
    onCloseShareDialog,
    onAddVideoView,
    isShareDialogOpen,
    playing,
    nextVideo,
    videoId,
    autoplay,
    videoStyle,
    isEmbedded,
    isPlayNextDisabled,
    availableTextTracks,
    isMinimized,
    onMinimizedExit,
    onError,
    ...videoJsConfig
  },
  externalRef
) => {
  const [player, playerRef] = useVideoJsPlayer(videoJsConfig)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTrack, setActiveTrack] = useState<AvailableTrack>()
  const [isSharingOverlayOpen, setIsSharingOverlayOpen] = useState(false)
  const { height: playerHeight = 0 } = useResizeObserver({ box: 'border-box', ref: playerRef })
  const customControlsRef = useRef<HTMLDivElement>(null)
  const {
    trackVideoPlaybackResumed,
    trackVideoPlaybackPaused,
    trackVideoPlaybackStarted,
    trackVideoPlaybackCompleted,
  } = useSegmentAnalytics()

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
    captionsEnabled,
    captionsLanguage,
    actions: { setCurrentVolume, setCachedVolume, setCinematicView, setCaptionsEnabled, setCaptionsLanguage },
  } = usePersonalDataStore((state) => state)
  const [volumeToSave, setVolumeToSave] = useState(0)
  const { video } = useFullVideo(videoId || '')

  const [videoTime, setVideoTime] = useState(0)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isPiPEnabled, setIsPiPEnabled] = useState(false)
  const [isSettingsPopoverOpened, setIsSettingsPopoverOpened] = useState(false)

  const [playerState, setPlayerState] = useState<PlayerState>('loading')
  const [isLoaded, setIsLoaded] = useState(false)
  const [needsManualPlay, setNeedsManualPlay] = useState(!autoplay)
  const mdMatch = useMediaMatch('md')
  const xsMatch = useMediaMatch('xs')
  const storedLanguageExists =
    captionsLanguage && availableTextTracks?.map((track) => track.language).includes(captionsLanguage)
  const findDefaultLanguage = useMemo(() => {
    if (!availableTextTracks) {
      return
    }
    return (
      availableTextTracks.find((availableTrack) =>
        storedLanguageExists ? availableTrack.language === captionsLanguage : availableTrack.language === 'en'
      ) || availableTextTracks[0]
    )
  }, [availableTextTracks, captionsLanguage, storedLanguageExists])

  const videoPlaybackData = useMemo(
    (): videoPlaybackParams => ({
      videoId: videoId ?? 'no data',
      channelId: video?.channel.id ?? 'no data',
      title: video?.title ?? 'no data',
      category: video?.category?.name ?? 'no data',
      totalLength: video?.duration ?? -1,
      fullScreen: isFullScreen,
      quality: video?.mediaMetadata?.pixelHeight?.toString() ?? '1',
    }),
    [
      videoId,
      video?.channel.id,
      video?.title,
      video?.category?.name,
      video?.duration,
      video?.mediaMetadata?.pixelHeight,
      isFullScreen,
    ]
  )

  const playVideo = useCallback(
    async (player: VideoJsPlayer | null, withIndicator?: boolean, callback?: () => void) => {
      if (!player) {
        return
      }
      withIndicator && player.trigger(CustomVideojsEvents.PlayControl)
      try {
        setNeedsManualPlay(false)
        const playPromise = await player.play()
        if (playPromise) {
          trackVideoPlaybackResumed(videoPlaybackData)
        }
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
            video: { id: videoId, urls: videoJsConfig.videoUrls },
          })
        }
      }
    },
    [trackVideoPlaybackResumed, videoId, videoPlaybackData, videoJsConfig.videoUrls]
  )

  const pauseVideo = useCallback(
    (player: VideoJsPlayer | null, withIndicator?: boolean, callback?: () => void) => {
      if (!player) {
        return
      }
      withIndicator && player.trigger(CustomVideojsEvents.PauseControl)
      callback?.()
      trackVideoPlaybackPaused(videoPlaybackData)
      player.pause()
    },
    [trackVideoPlaybackPaused, videoPlaybackData]
  )

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

      const playerReservedKeys = [
        'k',
        ' ',
        'ArrowLeft',
        'ArrowRight',
        'j',
        'l',
        'ArrowUp',
        'ArrowDown',
        'm',
        'f',
        't',
        'c',
      ]
      if (
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey &&
        playerReservedKeys.includes(event.key)
      ) {
        event.preventDefault()
        hotkeysHandler(
          event,
          player,
          playVideo,
          pauseVideo,
          () => setCinematicView(!cinematicView),
          captionsEnabled,
          () => setCaptionsEnabled(!captionsEnabled)
        )
      }
    }
    document.addEventListener('keydown', handler)

    return () => document.removeEventListener('keydown', handler)
  }, [captionsEnabled, cinematicView, pauseVideo, playVideo, player, playerState, setCaptionsEnabled, setCinematicView])

  // handle error
  useEffect(() => {
    if (!player) {
      return
    }
    const handler = () => {
      onError?.()
      setPlayerState('error')
    }
    player.on('error', handler)
    return () => {
      player.off('error', handler)
    }
  }, [onError, player])

  // handle setting playback rate
  useEffect(() => {
    if (!player) {
      return
    }
    // we need to set both - playbackRate and defaultPlaybackRate to make this persistent
    player.playbackRate(playbackRate)
    player.defaultPlaybackRate(playbackRate)
  }, [playbackRate, player])

  // When src is null that means something went wrong during asset resolution
  // No need to log anything here, error logging is handled in resolvers
  useEffect(() => {
    if (!videoJsConfig.videoUrls) {
      setPlayerState('error')
      onError?.()
    }
  }, [onError, videoJsConfig.videoUrls])

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
      trackVideoPlaybackCompleted(videoPlaybackData)
    }
    player.on('ended', handler)
    return () => {
      player.off('ended', handler)
    }
  }, [nextVideo, player, trackVideoPlaybackCompleted, videoPlaybackData])

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
          onAddVideoView?.()
          trackVideoPlaybackStarted(videoPlaybackData)
          setIsPlaying(true)
        })
        .catch((e) => {
          setNeedsManualPlay(true)
          ConsoleLogger.warn('Video autoplay failed', e)
        })
    }
  }, [player, isLoaded, autoplay, onAddVideoView, trackVideoPlaybackStarted, videoPlaybackData])

  // handle playing and pausing from outside the component
  useEffect(() => {
    if (!player) {
      return
    }
    if (playing) {
      playVideo(player)
      trackVideoPlaybackResumed(videoPlaybackData)
    } else {
      player.pause()
      trackVideoPlaybackPaused(videoPlaybackData)
    }
  }, [playVideo, player, playing, trackVideoPlaybackPaused, trackVideoPlaybackResumed, videoPlaybackData])

  // handle playing and pausing
  useEffect(() => {
    if (!player) {
      return
    }
    const handler = (event: Event) => {
      if (event.type === 'play') {
        trackVideoPlaybackResumed(videoPlaybackData)
        setIsPlaying(true)
      }
      if (event.type === 'pause') {
        trackVideoPlaybackPaused(videoPlaybackData)
        setIsPlaying(false)
      }
    }
    player.on(['play', 'pause'], handler)
    return () => {
      player.off(['play', 'pause'], handler)
    }
  }, [player, playerState, trackVideoPlaybackPaused, trackVideoPlaybackResumed, videoPlaybackData])

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

  // add available subtitles
  useEffect(() => {
    if (!player || !availableTextTracks || !availableTextTracks.length) {
      return
    }
    availableTextTracks.forEach((track) => {
      player.addRemoteTextTrack({ ...track, mode: 'hidden' }, false)
    })
  }, [availableTextTracks, player])

  useEffect(() => {
    if (!captionsEnabled || !captionsLanguage) {
      return
    }
    if (!storedLanguageExists) {
      setCaptionsEnabled(false)
      setCaptionsLanguage(null)
    }
  }, [
    availableTextTracks,
    captionsEnabled,
    storedLanguageExists,
    setCaptionsEnabled,
    setCaptionsLanguage,
    captionsLanguage,
  ])

  // handle toggling subtitles
  useEffect(() => {
    const tracks = player?.remoteTextTracks()
    if (!tracks || !availableTextTracks) {
      return
    }

    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i]

      if (!captionsEnabled) {
        track.mode = 'hidden'
      } else {
        if (activeTrack && activeTrack.language === track.language) {
          track.mode = 'showing'
        } else {
          track.mode = 'hidden'
        }
      }
    }
  }, [activeTrack, availableTextTracks, captionsEnabled, captionsLanguage, player, storedLanguageExists])

  useEffect(() => {
    if (!captionsEnabled || !availableTextTracks) {
      return
    }
    setActiveTrack(findDefaultLanguage)
  }, [captionsEnabled, findDefaultLanguage, availableTextTracks])

  // button/input handlers
  const handlePlayPause = useCallback(
    (shouldAddView?: boolean) => {
      if (playerState === 'error' || isSharingOverlayOpen) {
        return
      }
      if (shouldAddView) {
        onAddVideoView?.()
      }
      if (isPlaying) {
        pauseVideo(player, true, () => setIsPlaying(false))
      } else {
        playVideo(player, true, () => setIsPlaying(true))
      }
    },
    [isPlaying, isSharingOverlayOpen, onAddVideoView, pauseVideo, playVideo, player, playerState]
  )

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
      player?.exitPictureInPicture()
    } else {
      if (document.pictureInPictureEnabled) {
        player?.requestPictureInPicture().catch((e) => {
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

  const handleCloseSharingDialog = () => {
    onCloseShareDialog?.()
    setIsSharingOverlayOpen(false)
  }

  const toggleCinematicView = (event: MouseEvent) => {
    event.stopPropagation()
    setCinematicView(!cinematicView)
  }

  const handleToggleCaptions = async (event: MouseEvent) => {
    event.stopPropagation()
    if (!availableTextTracks) {
      return
    }
    if (!activeTrack && !captionsEnabled) {
      await setActiveTrack(findDefaultLanguage)
    } else {
      await setActiveTrack(undefined)
    }
    await setCaptionsEnabled(!captionsEnabled)
    player?.trigger(CustomVideojsEvents.CaptionsSet)
  }

  const handleTrackChange = (selectedTrack: AvailableTrack | undefined) => {
    const tracks = player?.remoteTextTracks()
    if (!tracks) {
      return
    }
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i]

      // Find the proper captions track and mark it as "showing".
      if (selectedTrack && track.language === selectedTrack.language) {
        track.mode = 'showing'
      } else {
        track.mode = 'hidden'
      }
    }
    setActiveTrack(selectedTrack)
  }

  const showPlayerControls = isEmbedded ? !needsManualPlay : isLoaded && playerState && !isSharingOverlayOpen
  const showControlsIndicator = playerState !== 'ended' && !isMinimized

  const playNextDisabled = isPlayNextDisabled || !autoPlayNext || isShareDialogOpen || isSharingOverlayOpen

  return (
    <Container
      isFullScreen={isFullScreen}
      captionsEnabled={captionsEnabled}
      className={className}
      isSettingsPopoverOpened={isSettingsPopoverOpened}
    >
      <div
        data-vjs-player
        onClick={() => {
          if (!(isShareDialogOpen || isSharingOverlayOpen)) {
            handlePlayPause()
          }
        }}
      >
        {needsManualPlay && (
          <BigPlayButtonContainer
            onClick={() => {
              handlePlayPause(true)
            }}
          >
            <BigPlayButton>
              <StyledSvgControlsPlay />
            </BigPlayButton>
          </BigPlayButtonContainer>
        )}
        <video style={videoStyle} ref={playerRef} className="video-js" onClick={onVideoClick} />
        {showPlayerControls && (
          <>
            <ControlsOverlay isSettingsPopoverOpened={isSettingsPopoverOpened} elevated={isFullScreen}>
              {isMinimized && (
                <MinimizedPlayerContorols onClick={(e) => e.stopPropagation()}>
                  <PlayerControlButton onClick={() => handlePlayPause(playerState === 'ended')} tooltipEnabled={false}>
                    {playerState === 'ended' ? (
                      <StyledSvgControlsReplay />
                    ) : isPlaying ? (
                      <StyledSvgControlsPause />
                    ) : (
                      <StyledSvgControlsPlay />
                    )}
                  </PlayerControlButton>
                  <PlayerControlButton tooltipEnabled={false} onClick={onMinimizedExit}>
                    <SvgActionClose />
                  </PlayerControlButton>
                </MinimizedPlayerContorols>
              )}
              <CustomTimeline
                playVideo={playVideo}
                pauseVideo={pauseVideo}
                player={player}
                elevated={isFullScreen || isEmbedded}
                playerState={playerState}
                setPlayerState={setPlayerState}
              />
              <CustomControls
                elevated={isFullScreen || isEmbedded}
                isEnded={playerState === 'ended' && !isMinimized}
                ref={customControlsRef}
                isSettingsPopoverOpened={isSettingsPopoverOpened}
              >
                {!isMinimized && (
                  <PlayControl isLoading={playerState === 'loading'}>
                    {(!needsManualPlay || mdMatch) && (
                      <PlayButton
                        isEnded={playerState === 'ended'}
                        onClick={() => handlePlayPause(playerState === 'ended')}
                        tooltipText={isPlaying ? 'Pause (k)' : playerState === 'ended' ? 'Play again (k)' : 'Play (k)'}
                        tooltipPosition="top-left"
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
                )}
                {!isMinimized && (
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
                )}
                <CurrentTimeWrapper>
                  <CurrentTime as="span" variant="t200">
                    {formatDurationShort(videoTime)} / {formatDurationShort(round(player?.duration() || 0))}
                  </CurrentTime>
                </CurrentTimeWrapper>
                <ScreenControls>
                  {!isMinimized && availableTextTracks && !!availableTextTracks.length && (
                    <PlayerControlButton
                      tooltipText={captionsEnabled ? 'Turn off subtitles / CC (c)' : 'Subtitles / CC (c)'}
                      onClick={handleToggleCaptions}
                    >
                      {captionsEnabled ? <SvgControlsCaptionsSolid /> : <SvgControlsCaptionsOutline />}
                    </PlayerControlButton>
                  )}
                  {!isMinimized && mdMatch && !isEmbedded && !player?.isFullscreen() && (
                    <PlayerControlButton
                      tooltipEnabled={!isSettingsPopoverOpened}
                      onClick={toggleCinematicView}
                      tooltipText={cinematicView ? 'Exit cinematic mode (t)' : 'Cinematic view (t)'}
                    >
                      {cinematicView ? (
                        <StyledSvgControlsVideoModeCompactView />
                      ) : (
                        <StyledSvgControlsVideoModeCinemaView />
                      )}
                    </PlayerControlButton>
                  )}
                  {!isMinimized && isPiPSupported && (
                    <PlayerControlButton
                      onClick={handlePictureInPicture}
                      tooltipText="Picture-in-picture"
                      tooltipEnabled={!isSettingsPopoverOpened}
                    >
                      {isPiPEnabled ? <StyledSvgControlsPipOff /> : <StyledSvgControlsPipOn />}
                    </PlayerControlButton>
                  )}
                  {!isMinimized && (
                    <SettingsButtonWithPopover
                      onSettingsPopoverToggle={setIsSettingsPopoverOpened}
                      isSettingsPopoverOpened={isSettingsPopoverOpened}
                      playerHeightWithoutCustomControls={playerHeightWithoutCustomControls}
                      boundariesElement={playerRef.current}
                      isFullScreen={isFullScreen}
                      availableTracks={availableTextTracks}
                      onTrackChange={handleTrackChange}
                      activeTrack={activeTrack}
                      player={player}
                    />
                  )}
                  <PlayerControlButton
                    isDisabled={!isFullScreenEnabled}
                    tooltipEnabled={!isSettingsPopoverOpened}
                    tooltipPosition="top-right"
                    tooltipText={isFullScreen ? 'Exit full screen (f)' : 'Full screen (f)'}
                    onClick={handleFullScreen}
                  >
                    {isFullScreen ? <StyledSvgControlsSmallScreen /> : <StyledSvgControlsFullScreen />}
                  </PlayerControlButton>
                  {isEmbedded && (
                    <a
                      onClick={(e) => e.stopPropagation()}
                      href={window.location.origin + absoluteRoutes.viewer.video(videoId)}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {xsMatch ? (
                        <StyledAppLogoFullMonochrome variant="full-monochrome" />
                      ) : (
                        <StyledAppLogoShortMonochrome variant="short-monochrome" />
                      )}
                    </a>
                  )}
                </ScreenControls>
              </CustomControls>
            </ControlsOverlay>
          </>
        )}
        <VideoOverlay
          videoId={videoId}
          currentVideoCreatedAt={video?.createdAt}
          isFullScreen={isFullScreen}
          isPlayNextDisabled={playNextDisabled}
          playerState={playerState}
          onPlayAgain={() => {
            handlePlayPause(true)
          }}
          channelId={video?.channel.id}
          currentThumbnailUrls={videoJsConfig.posterUrls}
          playRandomVideoOnEnded={!isEmbedded}
          isMinimized={isMinimized}
        />
        {showControlsIndicator && <ControlsIndicator player={player} isLoading={playerState === 'loading'} />}
        {isEmbedded && !isSharingOverlayOpen && (
          <>
            <EmbbeddedTopBarOverlay isFullScreen={isFullScreen}>
              <a href={absoluteRoutes.viewer.channel(video?.channel.id)} target="_blank" rel="noopener noreferrer">
                <Avatar
                  clickable
                  size={isFullScreen && !isMobile() ? 88 : 32}
                  assetUrls={channelAvatarUrls}
                  loading={isChannelAvatarLoading}
                />
              </a>
              <TitleContainer
                href={absoluteRoutes.viewer.video(videoId)}
                isFullscreen={isFullScreen}
                target="_blank"
                rel="noopener noreferrer"
              >
                <StyledText variant="h300" as="h2">
                  {video?.title}
                </StyledText>
                <StyledText variant="t100-strong" as="p" margin={{ top: 0.5 }}>
                  {video?.channel.title}
                </StyledText>
              </TitleContainer>
              <PlayerControlButton
                tooltipText="Share"
                tooltipPosition="bottom-right"
                onClick={(e) => {
                  setIsSharingOverlayOpen(true)
                  e.stopPropagation()
                }}
              >
                <StyledSvgControlsShare />
              </PlayerControlButton>
            </EmbbeddedTopBarOverlay>
            {needsManualPlay && (
              <StyledEmbeddedLogoLink
                href={absoluteRoutes.viewer.video(videoId)}
                rel="noopener noreferrer"
                target="_blank"
                onClick={(e) => e.stopPropagation()}
              >
                <StyledAppLogoFullMonochrome variant="full-monochrome" embedded />
              </StyledEmbeddedLogoLink>
            )}
          </>
        )}
        <VideoShare
          onCloseShareDialog={handleCloseSharingDialog}
          isEmbedded={isEmbedded}
          currentTime={videoTime}
          isFullScreen={isFullScreen}
          videoId={videoId}
          isShareDialogOpen={isShareDialogOpen || isSharingOverlayOpen}
          videoTitle={video?.title}
        />
      </div>
    </Container>
  )
}

export const VideoPlayer = forwardRef(VideoPlayerComponent)
