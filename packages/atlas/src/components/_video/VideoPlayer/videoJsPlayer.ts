import { RefObject, useEffect, useRef, useState } from 'react'
import { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js'
import videojs from 'video.js/dist/alt/video.core.novtt'

import { useGetAssetUrl } from '@/hooks/useGetAssetUrl'

export type VideoJsConfig = {
  videoUrls?: string[] | null
  width?: number
  height?: number
  fluid?: boolean
  fill?: boolean
  muted?: boolean
  loop?: boolean
  posterUrls?: string[] | null
  startTime?: number
  onDataLoaded?: () => void
  onPlay?: () => void
  onPause?: () => void
  onEnd?: () => void
  onTimeUpdated?: (time: number, playbackRate: number) => void
}

type VideoJsPlayerHook = (config: VideoJsConfig) => [VideoJsPlayer | null, RefObject<HTMLVideoElement>]
export const useVideoJsPlayer: VideoJsPlayerHook = ({
  fill,
  fluid,
  height,
  videoUrls,
  width,
  muted = false,
  loop = false,
  posterUrls,
  startTime = 0,
  onDataLoaded,
  onPlay,
  onPause,
  onEnd,
  onTimeUpdated,
}) => {
  const playerRef = useRef<HTMLVideoElement | null>(null)
  const [player, setPlayer] = useState<VideoJsPlayer | null>(null)
  const { url: src } = useGetAssetUrl(videoUrls, 'video')
  const { url: posterUrl } = useGetAssetUrl(posterUrls, 'cover')
  useEffect(() => {
    if (!playerRef.current) {
      return
    }
    const videoJsOptions: VideoJsPlayerOptions = {
      controls: true,
      playsinline: true,
      bigPlayButton: false,
      controlBar: false,
      preload: 'metadata',
    }

    const playerInstance = videojs(playerRef.current as Element, videoJsOptions)

    setPlayer(playerInstance)

    return () => {
      // playerInstance.dispose is causing the app breaks every time you updating the player
      // more details here:
      // https://github.com/videojs/video.js/issues/4970

      // for your convienience you can comment the line below while making changes to the player
      playerInstance.dispose()
      // but don't forget to uncomment once you're done with updating the player
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

    player.fill(Boolean(fill))
  }, [player, fill])

  useEffect(() => {
    if (!player) {
      return
    }

    player.muted(muted)
  }, [player, muted])

  useEffect(() => {
    if (!player) {
      return
    }
    player.loop(loop)
  }, [player, loop])

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
    const handler = () => onTimeUpdated(player.currentTime(), player.playbackRate())
    player.on('timeupdate', handler)

    return () => player.off('timeupdate', handler)
  }, [onTimeUpdated, player])

  return [player, playerRef]
}
