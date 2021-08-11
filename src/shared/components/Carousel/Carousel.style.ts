import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { colors, media, sizes, transitions, typography, zIndex } from '@/shared/theme'

import { IconButton } from '../IconButton'

export const CAROUSEL_ARROW_HEIGHT = 48

export const Container = styled.div`
  position: relative;
`

const rankingCss = css`
  counter-reset: ranking-counter;

  .glider-slide {
    position: relative;
    display: flex;
    justify-content: flex-end;
    counter-increment: ranking-counter;

    > * {
      width: 78%;
      display: flex;
      justify-content: flex-end;
    }

    ::before {
      position: absolute;
      content: counter(ranking-counter);
      z-index: -5;
      top: 0;
      left: 0;
      height: 50%;
      color: black;
      font-weight: 700;
      font-size: 100px;
      -webkit-text-stroke-width: 4px;
      -webkit-text-stroke-color: ${colors.gray[500]};
      font-family: 'PxGrotesk', sans-serif;
      letter-spacing: -0.17em;
      display: flex;
      align-items: center;

      ${media.large} {
        font-size: 140px;
      }

      ${media.xlarge} {
        font-size: 140px;
      }

      ${media.xxlarge} {
        font-size: 180px;
      }
    }
  }
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
`

type TrackProps = {
  hasRanking?: boolean
}

export const Track = styled.div<TrackProps>`
  align-items: flex-start;

  .glider-slide {
    margin-left: ${sizes(4)};
  }
  ${({ hasRanking }) => hasRanking && rankingCss};
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
