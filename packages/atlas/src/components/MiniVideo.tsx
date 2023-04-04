import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { forwardRef } from 'react'

import { Text } from '@/components/Text'
import { VideoPlayer, VideoPlayerProps } from '@/components/_video/VideoPlayer'
import { cVar, sizes } from '@/styles'

type MiniVideoProps = {
  isInView: boolean
  title?: string | null
  author?: string | null
} & VideoPlayerProps

export const MiniVideo = forwardRef<HTMLVideoElement, MiniVideoProps>(
  ({ isInView, author, title, ...videoPlayerProps }, ref) => {
    return (
      <Test in={isInView}>
        <VideoPlayer ref={ref} {...videoPlayerProps} />
        {!isInView && (
          <Details>
            <Text variant="h300" as="p" color="colorTextStrong">
              {title}
            </Text>
            <Text variant="t100" as="p" color="colorText">
              {author}
            </Text>
          </Details>
        )}
      </Test>
    )
  }
)

MiniVideo.displayName = 'MiniVideo'

const FadeIn = keyframes`
  0% { opacity: 0}
  100% { opacity: 1}
`

const Details = styled.div`
  width: 100%;
  height: 100px;
  margin-top: 180px;
  background-color: ${cVar('colorBackground')};
  display: grid;
  gap: ${sizes(1)};
  padding: ${sizes(4)};
`
export const Test = styled.div<{ in: boolean }>`
  display: flex;
  flex-direction: column;
  ${(props) =>
    !props.in &&
    css`
      width: 320px;
      position: fixed;
      z-index: 1000;
      right: 40px;
      bottom: 0;
      animation: ${FadeIn} 0.1s linear;

      > *:first-child {
        height: 180px;
      }
    `}
`
