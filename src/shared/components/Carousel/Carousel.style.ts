import styled from '@emotion/styled'

import { colors, media, sizes, transitions, typography, zIndex } from '@/shared/theme'

import { IconButton } from '../IconButton'

export const CAROUSEL_ARROW_HEIGHT = 48

export const Container = styled.div`
  position: relative;
`

export const Arrow = styled(IconButton)`
  display: none;
  z-index: ${zIndex.nearOverlay};
  cursor: pointer;
  padding: ${sizes(2)};
  font-size: ${typography.sizes.subtitle2};

  ${media.medium} {
    display: block;
  }

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

export const GliderContainer = styled.div`
  padding-left: ${sizes(2)};
  padding-top: ${sizes(2)};

  /* hides scrollbar on firefox */
  scrollbar-width: none;
`

export const Track = styled.div`
  .glider-slide:not(:first-of-type) {
    margin-left: ${sizes(4)};
    ${media.large} {
      margin-left: ${sizes(6)};
    }
  }
`

export const Dots = styled.div`
  padding: ${sizes(5.5)} 0;
  margin-top: ${sizes(12)};
  display: none;

  ${media.medium} {
    display: flex;
  }

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
