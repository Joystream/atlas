import { FC, ReactNode, useRef } from 'react'
import useResizeObserver from 'use-resize-observer'

import {
  InfiniteCarouselWrapper,
  InnerContainer,
  ItemContainer,
  ItemsWrapper,
  OverFlowHiddenWrapper,
} from './InfiniteCarousel.styles'

export type InfiniteCarouselProps = {
  items: ReactNode[]
  itemWidth: number
}

const isHorizontallyOverflow = (element: HTMLElement) => {
  return element.scrollWidth > element.clientWidth
}

export const InfiniteCarousel: FC<InfiniteCarouselProps> = ({ items, itemWidth }) => {
  const { width: overflowWrapperWidth, ref: overflowWrapperRef } = useResizeObserver({ box: 'border-box' })
  const ref = useRef<HTMLDivElement>(null)

  return (
    <InfiniteCarouselWrapper>
      <OverFlowHiddenWrapper ref={overflowWrapperRef}>
        <InnerContainer>
          <ItemsWrapper>
            {items.map((number, idx) => (
              <ItemContainer itemWidth={itemWidth} key={idx}>
                {number}
              </ItemContainer>
            ))}
          </ItemsWrapper>
          <ItemsWrapper>
            {items.map((number, idx) => (
              <ItemContainer itemWidth={itemWidth} key={idx}>
                {number}
              </ItemContainer>
            ))}
          </ItemsWrapper>
        </InnerContainer>
      </OverFlowHiddenWrapper>
    </InfiniteCarouselWrapper>
  )
}
