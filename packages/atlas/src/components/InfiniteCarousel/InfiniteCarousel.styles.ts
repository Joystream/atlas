import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { sizes } from '@/styles'

export const InfiniteCarouselWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`

export const OverFlowHiddenWrapper = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
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
  overflow: hidden;
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
