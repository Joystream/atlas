import styled from '@emotion/styled'
import Button from '../Button'
import { zIndex } from '../../theme'

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

export const Arrow = styled(Button)`
  position: absolute;
  width: ${CAROUSEL_ARROW_HEIGHT}px;
  height: ${CAROUSEL_ARROW_HEIGHT}px;
  transition: none;
  z-index: ${zIndex.nearOverlay};
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
  svg {
    width: auto;
    height: auto;
  }
`

export const GliderContainer = styled.div<HasPadding>`
  scrollbar-width: none;
  padding-left: ${(props) => props.paddingLeft}px;
  padding-top: ${(props) => props.paddingTop}px;
  margin-left: ${(props) => -props.paddingLeft}px;
  margin-top: ${(props) => -props.paddingTop}px;
`

export const Track = styled.div`
  align-items: flex-start;
`
