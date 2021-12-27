import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar } from '@/styles'

const sharedOverlayStyles = css`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 0;
  padding-top: 56.25%;
`

export const ContentOverlay = styled.div`
  ${sharedOverlayStyles}
  position: relative;
  background: brown;
  transition: transform ${cVar('animationTransitionFast')};
`

export const DefaultOverlay = styled.div`
  ${sharedOverlayStyles}
`

export const HoverOverlay = styled.div`
  ${sharedOverlayStyles}
`

type VideoThumbnailContainerProps = {
  clickable: boolean
}

export const SlotContainer = styled.div``

export const VideoThumbnailContainer = styled.div<VideoThumbnailContainerProps>`
  max-width: 320px;
  max-height: 180px;
  background-color: blue;
  position: relative;

  ${({ clickable }) =>
    clickable &&
    css`
      cursor: pointer;
      :hover ${ContentOverlay} {
        transform: translate(-8px, -8px);
      }
      :active ${ContentOverlay} {
        transform: translate(0, 0);
      }
    `}
`
