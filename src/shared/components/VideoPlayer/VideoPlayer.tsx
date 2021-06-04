import React, { useEffect, useState } from 'react'
import { Container, PlayOverlay } from './VideoPlayer.style'
import { useVideoJsPlayer, VideoJsConfig } from './videoJsPlayer'
import { SvgOutlineVideo } from '@/shared/icons'

export type VideoPlayerProps = {
  className?: string
  autoplay?: boolean
  isInBackground?: boolean
  playing?: boolean
} & VideoJsConfig

const VideoPlayer: React.ForwardRefRenderFunction<HTMLVideoElement, VideoPlayerProps> = (
  { className, autoplay, isInBackground, playing, ...videoJsConfig },
  externalRef
) => {
  const [player, playerRef] = useVideoJsPlayer(videoJsConfig)
  const [playOverlayVisible, setPlayOverlayVisible] = useState(true)
  const [initialized, setInitialized] = useState(false)

  const displayPlayOverlay = playOverlayVisible && !isInBackground

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

  useEffect(() => {
    if (!player || !initialized || !autoplay) {
      return
    }

    const playPromise = player.play()
    if (playPromise) {
      playPromise.catch((e) => {
        console.warn('Autoplay failed:', e)
      })
    }
  }, [player, initialized, autoplay])

  useEffect(() => {
    if (!player) {
      return
    }

    if (playing != null) {
      if (playing) {
        const playPromise = player.play()
        if (playPromise) {
          playPromise.catch((e) => {
            if (e.name === 'NotAllowedError') {
              console.warn('Video play failed:', e)
            } else {
              console.error('Video play failed:', e)
            }
          })
        }
      } else {
        player.pause()
      }
    }
  }, [player, playing])

  useEffect(() => {
    if (!player) {
      return
    }

    const handler = () => {
      setPlayOverlayVisible(false)
    }

    player.on('play', handler)

    return () => {
      player.off('play', handler)
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

  const handlePlayOverlayClick = () => {
    if (!player) {
      return
    }
    player.play()
  }

  return (
    <Container className={className} isInBackground={isInBackground}>
      {displayPlayOverlay && (
        <PlayOverlay onClick={handlePlayOverlayClick}>
          <SvgOutlineVideo width={72} height={72} viewBox="0 0 24 24" />
        </PlayOverlay>
      )}
      <div data-vjs-player>
        <video ref={playerRef} className="video-js" />
      </div>
    </Container>
  )
}

export default React.forwardRef(VideoPlayer)
