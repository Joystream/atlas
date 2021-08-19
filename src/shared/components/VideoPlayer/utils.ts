import { VideoJsPlayer } from 'video.js'

import { PlayerState } from '../VideoPlayer'

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

export const hotkeysHandler = (event: KeyboardEvent, playerInstance: VideoJsPlayer, playerState: PlayerState) => {
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
      if (playerState === 'loading') return
      if (!isPaused && playerState === 'playing') {
        playerInstance.pause()
        playerInstance.trigger(CustomVideojsEvents.PauseControl)
      } else {
        playerInstance.play()
        playerInstance.trigger(CustomVideojsEvents.PlayControl)
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
