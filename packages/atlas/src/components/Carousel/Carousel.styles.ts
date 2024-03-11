import styled from '@emotion/styled'
import { Swiper } from 'swiper/react'
import { SwiperOptions } from 'swiper/types'

import { Button } from '@/components/_buttons/Button'
import { cVar, media, sizes, transitions, zIndex } from '@/styles'

export const CAROUSEL_ARROW_HEIGHT = 48

type StyledSwiperProps = {
  minSlideWidth?: number
} & SwiperOptions

const isPropValid = (prop: string) => prop !== 'minSlideWidth'

export const StyledSwiper = styled(Swiper, { shouldForwardProp: isPropValid })<StyledSwiperProps>`
  width: 100%;

  .swiper-slide {
    height: unset;
  }

  .swiper-pagination {
    display: flex;
    justify-content: center;
  }

  .bullet {
    cursor: pointer;
    width: 36px;
    height: 20px;
    background-color: transparent;
    border: none;
    border-radius: 0;
    padding: ${sizes(2)} ${sizes(0.5)};
    margin: 0;

    &::after {
      content: '';
      width: 100%;
      height: ${sizes(1)};
      display: block;
      background-color: ${cVar('colorCoreNeutral700')};
      transition: all ${transitions.timings.regular} ${transitions.easing};
    }

    &:hover:not(.active) {
      &::after {
        background-color: ${cVar('colorCoreNeutral50')};
        transform: translateY(-2px);
      }
    }

    &.active {
      &::after {
        background-color: ${cVar('colorCoreNeutral300')};
      }
    }
  }
`

export const Arrow = styled(Button)`
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
