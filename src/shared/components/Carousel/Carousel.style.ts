import styled from '@emotion/styled'

import { zIndex } from '../../theme'
import { IconButton } from '../IconButton'

export const CAROUSEL_ARROW_HEIGHT = 48

export const Container = styled.div`
  position: relative;
`

type HasDirection = {
  direction: 'prev' | 'next'
}

type HasPadding = {
  paddingLeft: number
  paddingTop: number
}

type ArrowProps = {
  arrowPosition?: number
}

export const BackgroundGradient = styled.div<HasDirection & HasPadding>`
  position: absolute;
  top: 0;
  left: ${(props) => (props.direction === 'prev' ? 0 : 'auto')};
  right: ${(props) => (props.direction === 'next' ? 0 : 'auto')};
  bottom: 0;
  margin-left: ${(props) => -props.paddingLeft}px;
  margin-top: ${(props) => -props.paddingTop}px;
  width: 10%;
  z-index: ${zIndex.overlay};
  background-image: linear-gradient(
    ${(props) => (props.direction === 'prev' ? 270 : 90)}deg,
    transparent,
    var(--gradientColor, transparent)
  );
  pointer-events: none;
`

export const Arrow = styled(IconButton)<ArrowProps>`
  position: absolute;
  top: ${({ arrowPosition }) => arrowPosition && `${arrowPosition}px`};
  z-index: ${zIndex.nearOverlay};
  cursor: pointer;

  &.disabled {
    display: none;
  }

  &.glider-prev {
    left: 0;
  }

  &.glider-next {
    right: 0;
  }
  + ${BackgroundGradient} {
    --gradientColor: black;
  }
  &.disabled + ${BackgroundGradient} {
    --gradientColor: transparent;
  }
`

export const GliderContainer = styled.div<HasPadding>`
  padding-left: ${(props) => props.paddingLeft}px;
  padding-top: ${(props) => props.paddingTop}px;
  margin-left: ${(props) => -props.paddingLeft}px;
  margin-top: ${(props) => -props.paddingTop}px;
`

export const Track = styled.div`
  align-items: flex-start;
`
