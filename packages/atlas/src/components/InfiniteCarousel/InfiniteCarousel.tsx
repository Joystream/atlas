import { FC, ReactNode } from 'react'
import useResizeObserver from 'use-resize-observer'

import {
  InfiniteCarouselHeader,
  InfiniteCarouselWrapper,
  InnerContainer,
  ItemContainer,
  ItemsWrapper,
  OverFlowHiddenWrapper,
  StyledLimitedWidthContainer,
  SubtitleWrapper,
} from './InfiniteCarousel.styles'

import { Information, InformationProps } from '../Information'
import { GridItem, GridItemProps, LayoutGrid } from '../LayoutGrid'
import { Text } from '../Text'

export type InfiniteCarouselProps = {
  items: ReactNode[]
  itemWidth: number
  headerGridItemProps?: GridItemProps
  carouselHorizonthalOffset?: number
  title: string
  subTitle?: string
  informationProps?: InformationProps
  className?: string
}

export const InfiniteCarousel: FC<InfiniteCarouselProps> = ({
  items,
  itemWidth,
  title,
  headerGridItemProps = { colSpan: 12, colStart: 1 },
  carouselHorizonthalOffset,
  subTitle,
  informationProps,
  className,
}) => {
  const { width: itemsWrapperWidth = 0, ref: itemsWrapperRef } = useResizeObserver({ box: 'border-box' })
  const { width: overflowHiddenWrapperWidth = 0, ref: overflowHiddenWrapper } = useResizeObserver({ box: 'border-box' })

  const isOverflowing = itemsWrapperWidth > overflowHiddenWrapperWidth
  const animationTime = items.length * 2

  return (
    <div className={className}>
      <StyledLimitedWidthContainer>
        <LayoutGrid>
          <GridItem {...headerGridItemProps}>
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
          </GridItem>
        </LayoutGrid>
      </StyledLimitedWidthContainer>
      <InfiniteCarouselWrapper carouselHorizonthalOffset={carouselHorizonthalOffset}>
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
    </div>
  )
}
