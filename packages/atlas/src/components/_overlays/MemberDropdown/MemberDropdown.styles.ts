import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { animated } from 'react-spring'

import { cVar, media, sizes, zIndex } from '@/styles'

export const Container = styled.div`
  position: fixed;
  right: ${sizes(4)};
  height: 0;
  top: 0;
  width: 280px;
  z-index: ${zIndex.nearTransactionBar};

  ${media.md} {
    right: ${sizes(8)};
  }
`

export const SectionContainer = styled.div`
  border-top: 1px solid ${cVar('colorBorderMutedAlpha')};
  padding: ${sizes(2)} 0;
`

export const SlideAnimationContainer = styled(animated.div, { shouldForwardProp: isPropValid })<{
  disableVerticalScroll: boolean
}>`
  position: absolute;
  width: 280px;
  height: 100%;
  will-change: transform, opacity;
  overflow-x: hidden;
  overflow-y: ${({ disableVerticalScroll }) => (disableVerticalScroll ? 'hidden' : 'auto')};
`

export const InnerContainer = styled.div<{
  isActive: boolean
  containerHeight?: number
  disableVerticalScroll: boolean
}>`
  width: 280px;
  position: relative;
  max-height: calc(100vh - ${sizes(4)} - var(--size-topbar-height));
  height: ${({ containerHeight = 0 }) => containerHeight}px;
  transform: translateY(
    ${({ isActive, containerHeight = 0 }) =>
      isActive ? 'var(--size-topbar-height)' : `calc(-${containerHeight}px + var(--size-topbar-height)) `}
  );
  transition: transform ${cVar('animationTransitionMedium')}, height ${cVar('animationTransitionMedium')};
  will-change: height, transform;
  box-shadow: ${cVar('effectElevation24Layer2')}, ${cVar('effectElevation24Layer1')};
  border-radius: 0 0 ${cVar('radiusMedium')} ${cVar('radiusMedium')};
  background-color: ${cVar('colorBackgroundStrong')};
  overflow-x: hidden;
  overflow-y: ${({ disableVerticalScroll }) => (disableVerticalScroll ? 'hidden' : 'auto')};
`
