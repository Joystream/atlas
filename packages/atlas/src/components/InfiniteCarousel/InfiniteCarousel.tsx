import { FC, ReactNode } from 'react'
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

export const InfiniteCarousel: FC<InfiniteCarouselProps> = ({ items, itemWidth }) => {
  const { width: itemsWrapperWidth = 0, ref: itemsWrapperRef } = useResizeObserver({ box: 'border-box' })
  const { width: overflowHiddenWrapperWidth = 0, ref: overflowHiddenWrapper } = useResizeObserver({ box: 'border-box' })

  const isOverflowing = itemsWrapperWidth > overflowHiddenWrapperWidth
  const animationTime = items.length * 2

  return (
    <InfiniteCarouselWrapper>
      <OverFlowHiddenWrapper ref={overflowHiddenWrapper}>
        <InnerContainer
          itemsWrapperWidth={itemsWrapperWidth}
          shouldRunAnimation={isOverflowing}
          animationTime={animationTime}
        >
          <ItemsWrapper ref={itemsWrapperRef}>
            {items.map((number, idx) => (
              <ItemContainer itemWidth={itemWidth} key={idx}>
                {number}
              </ItemContainer>
            ))}
          </ItemsWrapper>
          {isOverflowing && (
            <ItemsWrapper>
              {items.map((number, idx) => (
                <ItemContainer itemWidth={itemWidth} key={idx}>
                  {number}
                </ItemContainer>
              ))}
            </ItemsWrapper>
          )}
        </InnerContainer>
      </OverFlowHiddenWrapper>
    </InfiniteCarouselWrapper>
  )
}
