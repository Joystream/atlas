import { RefObject, useEffect, useRef, useState } from 'react'
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js'
import 'video.js/dist/video-js.css'

export enum CustomVideojsEvents {
  BackwardFiveSec = 'BACKWARD_FIVE_SEC',
  BackwardTenSec = 'BACKWARD_TEN_SEC',
  ForwardFiveSec = 'FORWARD_FIVE_SEC',
  ForwardTenSec = 'FORWARD_TEN_SEC',
  Muted = 'MUTED',
  Unmuted = 'UNMUTED',
  VolumeIncrease = 'VOLUME_INCREASE',
  VolumeDecrease = 'VOLUME_DECREASE',
  PlayControl = 'PLAY_CONTROL',
  PauseControl = 'PAUSE_CONTROL',
}

export type VideoJsConfig = {
  src?: string | null
  width?: number
  height?: number
  fluid?: boolean
  fill?: boolean
  muted?: boolean
  posterUrl?: string | null
  startTime?: number
  onDataLoaded?: () => void
  onPlay?: () => void
  onPause?: () => void
  onEnd?: () => void
  onTimeUpdated?: (time: number) => void
}

export const VOLUME_STEP = 0.1

const hotkeysHandler = (event: videojs.KeyboardEvent, playerInstance: VideoJsPlayer) => {
  const currentTime = playerInstance.currentTime()
  const currentVolume = Number(playerInstance.volume().toFixed(2))
  const isMuted = playerInstance.muted()
  const isFullscreen = playerInstance.isFullscreen()
  const isPaused = playerInstance.paused()

  switch (event.code) {
    case 'Space':
    case 'KeyK':
      if (isPaused) {
        playerInstance.trigger(CustomVideojsEvents.PlayControl)
        playerInstance.play()
      } else {
        playerInstance.trigger(CustomVideojsEvents.PauseControl)
        playerInstance.pause()
      }
      return
    case 'ArrowLeft':
      playerInstance.trigger(CustomVideojsEvents.BackwardFiveSec)
      playerInstance.currentTime(currentTime - 5)
      return
    case 'ArrowRight':
      playerInstance.trigger(CustomVideojsEvents.ForwardFiveSec)
      playerInstance.currentTime(currentTime + 5)
      return
    case 'KeyJ':
      playerInstance.trigger(CustomVideojsEvents.BackwardTenSec)
      playerInstance.currentTime(currentTime - 10)
      return
    case 'KeyL':
      playerInstance.trigger(CustomVideojsEvents.ForwardTenSec)
      playerInstance.currentTime(currentTime + 10)
      return
    case 'ArrowUp':
      playerInstance.trigger(CustomVideojsEvents.VolumeIncrease)
      if (currentVolume <= 0.9) {
        playerInstance.volume(currentVolume + VOLUME_STEP)
      } else {
        playerInstance.volume(1)
      }
      return
    case 'ArrowDown':
      playerInstance.trigger(CustomVideojsEvents.VolumeDecrease)
      if (currentVolume >= VOLUME_STEP) {
        playerInstance.volume(currentVolume - VOLUME_STEP)
      } else {
        playerInstance.volume(0)
      }
      return
    case 'KeyM':
      if (isMuted) {
        playerInstance.trigger(CustomVideojsEvents.Unmuted)
        playerInstance.muted(false)
      } else {
        playerInstance.trigger(CustomVideojsEvents.Muted)
        playerInstance.muted(true)
      }
      return
    case 'KeyF':
      if (isFullscreen) {
        playerInstance.exitFullscreen()
      } else {
        playerInstance.requestFullscreen()
      }
      return
    default:
      return
  }
}

type VideoJsPlayerHook = (config: VideoJsConfig) => [VideoJsPlayer | null, RefObject<HTMLVideoElement>]
export const useVideoJsPlayer: VideoJsPlayerHook = ({
  fill,
  fluid,
  height,
  src,
  width,
  muted = false,
  posterUrl,
  startTime = 0,
  onDataLoaded,
  onPlay,
  onPause,
  onEnd,
  onTimeUpdated,
}) => {
  const playerRef = useRef<HTMLVideoElement>(null)
  const [player, setPlayer] = useState<VideoJsPlayer | null>(null)

  useEffect(() => {
    if (!playerRef.current) {
      return
    }
    const videoJsOptions: VideoJsPlayerOptions = {
      controls: true,
      // @ts-ignore @types/video.js is outdated and doesn't provide types for some newer video.js features
      playsinline: true,
      bigPlayButton: false,
      userActions: {
        hotkeys: (event) => hotkeysHandler(event, playerInstance),
      },
      controlBar: {
        // hide all videojs controls besides progress bar
        children: [],
        progressControl: {
          seekBar: true,
        },
      },
    }

    const playerInstance = videojs(playerRef.current as Element, videoJsOptions)

    setPlayer(playerInstance)
    playerRef.current.focus()

    return () => {
      playerInstance.dispose()
    }
  }, [])

  useEffect(() => {
    if (!player || !src) {
      return
    }
    player.src({
      src: src,
      type: 'video/mp4',
    })
  }, [player, src])

  useEffect(() => {
    if (!player || !width) {
      return
    }

    player.width(width)
  }, [player, width])

  useEffect(() => {
    if (!player || !height) {
      return
    }

    player.height(height)
  }, [player, height])

  useEffect(() => {
    if (!player) {
      return
    }

    player.fluid(Boolean(fluid))
  }, [player, fluid])

  useEffect(() => {
    if (!player) {
      return
    }

    // @ts-ignore @types/video.js is outdated and doesn't provide types for some newer video.js features
    player.fill(Boolean(fill))
  }, [player, fill])

  useEffect(() => {
    if (!player) {
      return
    }

    player.muted(muted)
  }, [player, muted])

  useEffect(() => {
    if (!player || !posterUrl) {
      return
    }

    player.poster(posterUrl)
  }, [player, posterUrl])

  useEffect(() => {
    if (!player || !onDataLoaded) {
      return
    }

    player.on('loadeddata', onDataLoaded)

    return () => {
      player.off('loadeddata', onDataLoaded)
    }
  }, [player, onDataLoaded])

  useEffect(() => {
    if (!player || !startTime) {
      return
    }

    player.currentTime(startTime)
  }, [player, startTime])

  useEffect(() => {
    if (!player || !onPlay || !player.paused()) {
      return
    }

    player.on('play', onPlay)

    return () => {
      player.off('play', onPlay)
    }
  }, [player, onPlay])

  useEffect(() => {
    if (!player || !onPause || player.paused()) {
      return
    }

    player.on('pause', onPause)

    return () => {
      player.off('pause', onPause)
    }
  }, [player, onPause])

  useEffect(() => {
    if (!player || !onEnd) {
      return
    }
    player.on('ended', onEnd)

    return () => player.off('ended', onEnd)
  }, [player, onEnd])

  useEffect(() => {
    if (!player || !onTimeUpdated) {
      return
    }
    const handler = () => onTimeUpdated(player.currentTime())
    player.on('timeupdate', handler)

    return () => player.off('timeupdate', handler)
  }, [onTimeUpdated, player])

  return [player, playerRef]
}
