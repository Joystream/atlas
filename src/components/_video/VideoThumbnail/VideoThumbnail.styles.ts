import isPropValid from '@emotion/is-prop-valid'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar, square } from '@/styles'

const sharedOverlayStyles = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding-top: 56.25%;
  transition: ${cVar('animationTransitionFast')};
`

export type SlotPosition = 'topLeft' | 'topRight' | 'center' | 'bottomLeft' | 'bottomRight'

const getSlotPosition = (slotPosition: SlotPosition) => {
  switch (slotPosition) {
    case 'topLeft':
      return css`
        top: 8px;
        left: 8px;
      `
    case 'topRight':
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
    case 'bottomLeft':
      return css`
        bottom: 8px;
        left: 8px;
      `
    case 'bottomRight':
      return css`
        bottom: 8px;
        right: 8px;
      `
  }
}

type SlotsContainerProps = {
  position: SlotPosition
  type?: 'default' | 'hover'
}

export const SlotContainer = styled.div<SlotsContainerProps>`
  position: absolute;
  user-select: none;
  ${({ position }) => getSlotPosition(position)};
  opacity: ${({ type = 'default' }) => (type === 'hover' ? 0 : 1)};
  transition: opacity ${cVar('animationTransitionFast')};
`

export const ContentOverlay = styled.div`
  ${sharedOverlayStyles}
  position: relative;
  background: black;
  transition: transform ${cVar('animationTransitionFast')};
  display: flex;
  justify-content: center;
`

export const ContentContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`

export const ThumbnailImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  object-fit: contain;
  ${square('100%')}
`

export const SlotsOverlay = styled.div`
  ${sharedOverlayStyles}
`

type HoverOverlayProps = {
  loading?: boolean
}

export const HoverOverlay = styled('div', { shouldForwardProp: isPropValid })<HoverOverlayProps>`
  ${sharedOverlayStyles}
  background: ${({ loading }) => (loading ? 'none ' : cVar('colorBackgroundOverlay'))};
  opacity: 0;
`

type VideoThumbnailContainerProps = {
  clickable: boolean
  activeDisabled: boolean
}
export const VideoThumbnailContainer = styled('div', { shouldForwardProp: isPropValid })<VideoThumbnailContainerProps>`
  min-width: 166px;
  display: block;
  position: relative;
  background-color: black;
  transition: background-color ${cVar('animationTransitionFast')};

  ${({ clickable }) =>
    clickable &&
    css`
      :hover {
        cursor: pointer;
        background-color: ${cVar('colorBackgroundPrimary')};

        ${ContentOverlay}, ${HoverOverlay}, ${SlotsOverlay} {
          transform: translate(-8px, -8px);
        }
        ${HoverOverlay}, ${SlotContainer} {
          opacity: 1;
        }
      }
    `}
  ${({ clickable, activeDisabled }) =>
    clickable &&
    !activeDisabled &&
    css`
      :active {
        ${ContentOverlay}, ${HoverOverlay}, ${SlotsOverlay} {
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
