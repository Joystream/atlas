import { forwardRef, useEffect, useState } from 'react'

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
    const isAllowed = usePersonalDataStore((state) => state.allowMinimizedPleyer)
    const mdMatch = useMediaMatch('md')

    useEffect(() => {
      if (isInView) {
        setForceExit(false)
      }
    }, [isInView])

    const inView = isAllowed && mdMatch ? isInView || forceExit : true

    return (
      <Wrapper isInView={inView}>
        <VideoPlayer ref={ref} isMinimized={!inView} onMinimizedExit={() => setForceExit(true)} {...videoPlayerProps} />
      </Wrapper>
    )
  }
)

MinimizedPlayer.displayName = 'MinimizedPlayer'
