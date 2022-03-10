import styled from '@emotion/styled'

import { IconButton } from '@/components/_buttons/IconButton'
import { cVar, media, oldColors, sizes, transitions, zIndex } from '@/styles'

export const CAROUSEL_ARROW_HEIGHT = 48

export const Container = styled.div`
  position: relative;
`

export const Arrow = styled(IconButton)`
  display: none;
  z-index: ${zIndex.nearOverlay};
  cursor: pointer;
  padding: ${sizes(2)};
  font: ${cVar('typographyDesktopH200')};
  letter-spacing: ${cVar('typographyDesktopH200LetterSpacing')};
  text-transform: ${cVar('typographyDesktopH200TextTransform')};

  ${media.md} {
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

    ${media.lg} {
      margin-left: ${sizes(6)};
    }
  }
`

export const Dots = styled.div`
  margin-top: ${sizes(12)};
  display: none;

  ${media.md} {
    display: flex;
  }

  .glider-dot {
    width: 36px;
    height: 20px;
    background-color: transparent;
    border-radius: 0;
    padding: ${sizes(2)} ${sizes(0.5)};
    margin: 0;

    &::after {
      content: '';
      width: 100%;
      height: ${sizes(1)};
      display: block;
      background-color: ${oldColors.gray[700]};
      transition: all ${transitions.timings.regular} ${transitions.easing};
    }

    &:hover:not(.active) {
      &::after {
        background-color: ${oldColors.gray[50]};
        transform: translateY(-2px);
      }
    }

    &.active {
      &::after {
        background-color: ${oldColors.gray[300]};
      }
    }
  }
`
