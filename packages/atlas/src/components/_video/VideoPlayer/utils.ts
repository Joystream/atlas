import { VideoJsPlayer } from 'video.js'

import { isIphone } from '@/utils/browser'

export type PlayerState = 'loading' | 'ended' | 'error' | 'playingOrPaused' | 'pending'

export const VOLUME_STEP = 0.1

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

export const isFullScreenEnabled =
  document.fullscreenEnabled ||
  document.webkitFullscreenEnabled ||
  document.mozFullScreenEnabled ||
  document.msFullscreenEnabled ||
  // these properties above are not available on iphone, so these checks will always return undefined.
  // it looks like we can't fully disable fullscreen on embedded view on iphone with `allowfullscreen` property on iframe, that's why we always return true if device is `iPhone`
  isIphone

export const hotkeysHandler = (
  event: KeyboardEvent,
  playerInstance: VideoJsPlayer,
  playVideo: (player: VideoJsPlayer | null, withIndicator?: boolean, callback?: () => void) => Promise<void>,
  pauseVideo: (player: VideoJsPlayer | null, withIndicator?: boolean, callback?: () => void) => void,
  toggleCinematicView: () => void
) => {
  if (!playerInstance) {
    return
  }
  const currentTime = playerInstance.currentTime()
  const currentVolume = Number(playerInstance.volume().toFixed(2))
  const isMuted = playerInstance.muted()
  const isFullscreen = playerInstance.isFullscreen()
  const duration = playerInstance.duration()
  const isPaused = playerInstance.paused()
  const isEnded = currentTime === duration

  switch (event.code) {
    case 'Space':
    case 'KeyK':
      if (!isPaused) {
        pauseVideo(playerInstance, true)
      }
      if (isPaused) {
        playVideo(playerInstance, true)
      }
      return
    case 'ArrowLeft':
      playerInstance.currentTime(currentTime - 5)
      playerInstance.trigger(CustomVideojsEvents.BackwardFiveSec)
      return
    case 'ArrowRight':
      if (isEnded) {
        return
      }
      playerInstance.currentTime(currentTime + 5)
      playerInstance.trigger(CustomVideojsEvents.ForwardFiveSec)
      return
    case 'KeyJ':
      playerInstance.currentTime(currentTime - 10)
      playerInstance.trigger(CustomVideojsEvents.BackwardTenSec)
      return
    case 'KeyL':
      if (isEnded) {
        return
      }
      playerInstance.currentTime(currentTime + 10)
      playerInstance.trigger(CustomVideojsEvents.ForwardTenSec)
      return
    case 'ArrowUp':
      if (playerInstance.muted()) {
        playerInstance.muted(false)
      }
      if (currentVolume <= 1) {
        playerInstance.volume(Math.min(currentVolume + VOLUME_STEP, 1))
      }
      playerInstance.trigger(CustomVideojsEvents.VolumeIncrease)
      return
    case 'ArrowDown':
      if (currentVolume >= 0) {
        playerInstance.volume(Math.max(currentVolume - VOLUME_STEP, 0))
      }
      playerInstance.trigger(CustomVideojsEvents.VolumeDecrease)
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
      if (!isFullScreenEnabled) {
        return
      }
      if (isFullscreen) {
        playerInstance.exitFullscreen()
      } else {
        playerInstance.requestFullscreen()
      }
      return
    case 'KeyC':
      !playerInstance.isFullscreen() && toggleCinematicView()
      return
    default:
      return
  }
}
