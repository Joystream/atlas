import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar, square } from '@/styles'

const sharedOverlayStyles = css`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 0;
  padding-top: 56.25%;
  transition: ${cVar('animationTransitionFast')};
`

export type SlotPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'

const getSlotPosition = (slotPosition: SlotPosition) => {
  switch (slotPosition) {
    case 'top-left':
      return css`
        top: 8px;
        left: 8px;
      `
    case 'top-right':
      return css`
        top: 8px;
        right: 8px;
      `
    case 'center':
      return css`
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      `
    case 'bottom-left':
      return css`
        bottom: 8px;
        left: 8px;
      `
    case 'bottom-right':
      return css`
        bottom: 8px;
        right: 8px;
      `
  }
}

export const SlotContainer = styled.div<{ position: SlotPosition }>`
  position: absolute;
  ${({ position }) => getSlotPosition(position)};
`

export const ContentSlot = styled.div``

export const ContentOverlay = styled.div`
  ${sharedOverlayStyles}
  position: relative;
  background: black;
  transition: transform ${cVar('animationTransitionFast')};
  display: flex;
  justify-content: center;
`
export const ThumbnailImage = styled.img`
  position: absolute;
  user-select: none;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  right: 0;
  bottom: 0;
  height: 100%;
`

export const DefaultOverlay = styled.div`
  ${sharedOverlayStyles}
`

export const HoverOverlay = styled.div`
  ${sharedOverlayStyles}
  background: ${cVar('colorBackgroundOverlay')};
  opacity: 0;
`

type VideoThumbnailContainerProps = {
  clickable: boolean
  activeDisabled: boolean
}
export const VideoThumbnailContainer = styled.div<VideoThumbnailContainerProps>`
  max-width: 320px;
  display: block;
  max-height: 180px;
  position: relative;
  background-color: black;
  transition: background-color ${cVar('animationTransitionFast')};

  ${({ clickable }) =>
    clickable &&
    css`
      :hover {
        cursor: pointer;
        background-color: ${cVar('colorBackgroundPrimary')};

        ${ContentOverlay}, ${HoverOverlay}, ${DefaultOverlay} {
          transform: translate(-8px, -8px);
        }
        ${HoverOverlay} {
          opacity: 1;
        }
      }
    `}
  ${({ clickable, activeDisabled }) =>
    clickable &&
    !activeDisabled &&
    css`
      :active {
        ${ContentOverlay}, ${HoverOverlay}, ${DefaultOverlay} {
          transform: translate(0, 0);
        }
      }
    `};
`

export const ThumbnailSkeletonLoader = styled(SkeletonLoader)`
  ${square('100%')}

  position: absolute;
  top: 0;
  left: 0;
`
