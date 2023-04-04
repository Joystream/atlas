import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { media, sizes } from '@/styles'

import { LimitedWidthContainer } from '../LimitedWidthContainer'

export const StyledLimitedWidthContainer = styled(LimitedWidthContainer)`
  padding-bottom: unset;
`

export const InfiniteCarouselHeader = styled.header`
  margin-bottom: ${sizes(6)};
  text-align: left;
  ${media.md} {
    margin-bottom: ${sizes(10)};
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`
export const InfiniteCarouselWrapper = styled.div<{ carouselHorizonthalOffset?: number }>`
  overflow-x: hidden;
  overflow-y: visible;
  margin-top: -${sizes(2)};
  padding-top: ${sizes(2)};
  margin-left: ${({ carouselHorizonthalOffset }) => `${carouselHorizonthalOffset || 0}px`};
  margin-right: ${({ carouselHorizonthalOffset }) => `${carouselHorizonthalOffset || 0}px`};
  ${InfiniteCarouselHeader} {
    padding-left: ${({ carouselHorizonthalOffset }) => `${(carouselHorizonthalOffset || 0) * -1}px`};
    padding-right: ${({ carouselHorizonthalOffset }) => `${(carouselHorizonthalOffset || 0) * -1}px`};
  }
`

export const SubtitleWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const OverFlowHiddenWrapper = styled.div`
  width: 100%;
`

const scroll = (itemsWrapperWidth: number) => keyframes`
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-${itemsWrapperWidth}px);
    }
`
type InnerContainerProps = {
  itemsWrapperWidth: number
  shouldRunAnimation: boolean
  animationTime: number
}

export const InnerContainer = styled.div<InnerContainerProps>`
  display: flex;
  justify-content: space-around;
  width: ${({ itemsWrapperWidth, shouldRunAnimation }) =>
    shouldRunAnimation ? ` ${itemsWrapperWidth * 2}px` : 'unset'};
  animation: ${({ itemsWrapperWidth, shouldRunAnimation, animationTime }) =>
    shouldRunAnimation
      ? css`
          ${scroll(itemsWrapperWidth)} ${animationTime}s linear infinite
        `
      : 'unset'};

  :hover {
    animation-play-state: paused;
  }
`

export const ItemsWrapper = styled.div`
  display: flex;
`

type ItemContainerProps = {
  itemWidth: number
}
export const ItemContainer = styled.div<ItemContainerProps>`
  width: ${({ itemWidth }) => itemWidth}px;
  margin: 0 ${sizes(2)};
  align-items: center;
  flex-shrink: 0;
`
