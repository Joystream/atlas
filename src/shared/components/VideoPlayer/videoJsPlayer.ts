import { RefObject, useEffect, useRef, useState } from 'react'
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js'
import 'video.js/dist/video-js.css'

import { STORAGE_NODE_URL } from '@/config/urls'
import { Asset, AssetStorage, VideoFieldsFragment } from '@/api/queries'

export type VideoJsConfig = {
  src: VideoFieldsFragment['media']
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

const createJoystreamStorageUrl = (src: VideoFieldsFragment['media']) => {
  if (src?.__typename === 'AssetStorage') {
    const id = src.uploadStatus.dataObject.joystreamContentId
    const url = new URL(id, STORAGE_NODE_URL)
    return url.href
  }
  // do something here
  return 'some url'
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

  const parsedSource = src?.__typename === 'AssetUrl' ? src.url : createJoystreamStorageUrl(src)

  useEffect(() => {
    const videoJsOptions: VideoJsPlayerOptions = {
      controls: true,
      // @ts-ignore @types/video.js is outdated and doesn't provide types for some newer video.js features
      playsinline: true,
    }

    const playerInstance = videojs(playerRef.current, videoJsOptions)
    setPlayer(playerInstance)

    return () => {
      playerInstance.dispose()
    }
  }, [])

  useEffect(() => {
    if (!player) {
      return
    }

    player.src({
      src: parsedSource,
      type: 'video/mp4',
    })
  }, [player, parsedSource])

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
    if (!player || !onPlay) {
      return
    }

    player.on('play', onPlay)

    return () => {
      player.off('play', onPlay)
    }
  }, [player, onPlay])

  useEffect(() => {
    if (!player || !onPause) {
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
