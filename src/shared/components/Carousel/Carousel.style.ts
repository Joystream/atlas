import styled from '@emotion/styled'

import { colors, sizes, transitions, typography, zIndex } from '@/shared/theme'

import { IconButton } from '../IconButton'

export const CAROUSEL_ARROW_HEIGHT = 48

export const Container = styled.div`
  position: relative;
`

type HasPadding = {
  paddingLeft: number
  paddingTop: number
}

export const Arrow = styled(IconButton)`
  z-index: ${zIndex.nearOverlay};
  cursor: pointer;
  padding: ${sizes(2)};
  font-size: ${typography.sizes.subtitle2};

  &.disabled {
    opacity: 0.5;
  }

  &.glider-prev,
  &.glider-next {
    position: relative;
    top: 0;
    padding: ${sizes(2)};
  }

  &.glider-prev {
    left: 0;
  }

  &.glider-next {
    right: 0;
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

export const Dots = styled.div`
  margin-top: ${sizes(13)};

  .glider-dot {
    background-color: transparent;
    width: ${sizes(10)};
    border-radius: 0;
    padding: ${sizes(1)};
    margin: 0;

    &::after {
      content: '';
      width: 100%;
      height: ${sizes(1)};
      display: block;
      background-color: ${colors.gray[700]};
      transition: all ${transitions.timings.regular} ${transitions.easing};
    }

    &:hover:not(.active) {
      &::after {
        background-color: ${colors.gray[50]};
        transform: translateY(-2px);
      }
    }

    &.active {
      &::after {
        background-color: ${colors.gray[300]};
      }
    }
  }
`
