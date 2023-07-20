import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { animated } from 'react-spring'

import { cVar, media, sizes, zIndex } from '@/styles'

export const Container = styled.div`
  position: fixed;
  right: ${sizes(4)};
  top: 68px;
  width: 280px;
  z-index: ${zIndex.header + 1};
  border-radius: ${cVar('radiusLarge')};
  overflow: hidden;

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
  max-height: calc(100vh - ${sizes(4)} - var(--size-topbar-height));
  height: ${({ containerHeight = 0 }) => containerHeight}px;
  transition: height ${cVar('animationTransitionMedium')};
  will-change: height;
  box-shadow: ${cVar('effectElevation24Layer2')}, ${cVar('effectElevation24Layer1')};
  background-color: ${cVar('colorBackgroundStrong')};
  overflow-x: hidden;
  overflow-y: ${({ disableVerticalScroll }) => (disableVerticalScroll ? 'hidden' : 'auto')};
`
