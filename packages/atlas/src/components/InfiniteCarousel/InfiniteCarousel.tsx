import { FC, ReactNode } from 'react'
import useResizeObserver from 'use-resize-observer'

import {
  InfiniteCarouselHeader,
  InfiniteCarouselWrapper,
  InnerContainer,
  ItemContainer,
  ItemsWrapper,
  OverFlowHiddenWrapper,
  SubtitleWrapper,
} from './InfiniteCarousel.styles'

import { Information, InformationProps } from '../Information'
import { Text } from '../Text'

export type InfiniteCarouselProps = {
  items: ReactNode[]
  itemWidth: number
  title: string
  subTitle?: string
  informationProps?: InformationProps
  className?: string
}

export const InfiniteCarousel: FC<InfiniteCarouselProps> = ({
  items,
  itemWidth,
  title,
  subTitle,
  informationProps,
  className,
}) => {
  const { width: itemsWrapperWidth = 0, ref: itemsWrapperRef } = useResizeObserver({ box: 'border-box' })
  const { width: overflowHiddenWrapperWidth = 0, ref: overflowHiddenWrapper } = useResizeObserver({ box: 'border-box' })

  const isOverflowing = itemsWrapperWidth > overflowHiddenWrapperWidth
  const animationTime = items.length * 2

  return (
    <InfiniteCarouselWrapper className={className}>
      <InfiniteCarouselHeader>
        <Text as="h2" variant="h500">
          {title}
        </Text>
        {(subTitle || informationProps) && (
          <SubtitleWrapper>
            {subTitle && (
              <Text variant="t200" as="p" color="colorText" margin={{ right: 1 }}>
                {subTitle}
              </Text>
            )}
            {informationProps && <Information {...informationProps} />}
          </SubtitleWrapper>
        )}
      </InfiniteCarouselHeader>
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
