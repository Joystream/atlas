import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { sizes } from '@/styles'

export const InfiniteCarouselWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`
const scroll = keyframes`
    0% {
      left:0;
    }
    100% {
      left: -100%;
    }
    `
export const OverFlowHiddenWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
  height: 500px;
`

export const InnerContainer = styled.div`
  overflow: hidden;
  width: 200%;
  display: flex;
  position: absolute;
  left: 0;
  animation: ${scroll} 3s linear infinite;
  justify-content: space-around;
`

type ItemContainerProps = {
  itemWidth: number
}

export const ItemsWrapper = styled.div`
  display: flex;
  width: 50%;
`

export const ItemContainer = styled.div<ItemContainerProps>`
  width: ${({ itemWidth }) => itemWidth}px;
  margin: 0 ${sizes(2)};
  align-items: center;
  flex-shrink: 0;
`
