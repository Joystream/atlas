import { forwardRef, useEffect, useMemo, useState } from 'react'

import { VideoPlayer, VideoPlayerProps } from '@/components/_video/VideoPlayer'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { usePersonalDataStore } from '@/providers/personalData'

import { Wrapper } from './MinimizedPlayer.styles'

type MiniVideoProps = {
  isInView: boolean
  title?: string | null
  author?: string | null
} & Omit<VideoPlayerProps, 'isMinimized'>

export const MinimizedPlayer = forwardRef<HTMLVideoElement, MiniVideoProps>(
  ({ isInView, author, title, ...videoPlayerProps }, ref) => {
    const [forceExit, setForceExit] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [wasPausedOnTop, setWasPausedTop] = useState(false)
    const isAllowed = usePersonalDataStore((state) => state.allowMinimizedPleyer)
    const mdMatch = useMediaMatch('md')

    useEffect(() => {
      if (isInView) {
        setForceExit(false)
        setWasPausedTop(isPaused)
      }
    }, [isInView, isPaused])

    const inView = isAllowed && mdMatch && !wasPausedOnTop ? isInView || forceExit || hasError : true

    const actions = useMemo(
      () => ({
        onPause: () => {
          setIsPaused(true)
          videoPlayerProps.onPause?.()
        },
        onPlay: () => {
          setIsPaused(false)
          videoPlayerProps.onPlay?.()
        },
        onError: () => setHasError(true),
        onMinimizedExit: () => setForceExit(true),
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [videoPlayerProps.onPlay, videoPlayerProps.onPause]
    )

    return (
      <Wrapper isInView={inView}>
        <VideoPlayer ref={ref} isMinimized={!inView} {...actions} {...videoPlayerProps} />
      </Wrapper>
    )
  }
)

MinimizedPlayer.displayName = 'MinimizedPlayer'
