import { forwardRef, useEffect, useState } from 'react'

import { Text } from '@/components/Text'
import { VideoPlayer, VideoPlayerProps } from '@/components/_video/VideoPlayer'

import { Details, Wrapper } from './MinimizedPlayer.styles'

type MiniVideoProps = {
  isInView: boolean
  title?: string | null
  author?: string | null
} & Omit<VideoPlayerProps, 'isMinimized'>

export const MinimizedPlayer = forwardRef<HTMLVideoElement, MiniVideoProps>(
  ({ isInView, author, title, ...videoPlayerProps }, ref) => {
    const [forceExit, setForceExit] = useState(false)

    useEffect(() => {
      if (isInView) {
        setForceExit(false)
      }
    }, [isInView])

    const inView = isInView || forceExit

    return (
      <Wrapper isInView={inView}>
        <VideoPlayer ref={ref} isMinimized={!inView} onMinimizedExit={() => setForceExit(true)} {...videoPlayerProps} />
        {!inView && (
          <Details>
            <Text variant="h300" as="p" color="colorTextStrong">
              {title}
            </Text>
            <Text variant="t100" as="p" color="colorText">
              {author}
            </Text>
          </Details>
        )}
      </Wrapper>
    )
  }
)

MinimizedPlayer.displayName = 'MinimizedPlayer'
