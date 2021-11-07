import React, { ComponentProps, useRef } from 'react'

import { SvgGlyphChevronLeft, SvgGlyphChevronRight, SvgPlayerPlay } from '@/icons'

import { CarouselArrowsContainer, Container, SeeAllLink } from './Gallery.style'

import { Carousel, CarouselProps } from '../Carousel'
import { Arrow } from '../Carousel/Carousel.style'
import { GridHeadingContainer, TitleContainer } from '../GridHeading'
import { Text } from '../Text'

export type GalleryProps = {
  title?: string
  className?: string
  seeAllUrl?: string
} & CarouselProps

type ImperativeHandleData = {
  getPrevArrowProps: () => ComponentProps<typeof Arrow>
  getNextArrowProps: () => ComponentProps<typeof Arrow>
}

export const Gallery: React.FC<GalleryProps> = ({ title, className, seeAllUrl, ...carouselProps }) => {
  // TODO: this is the only place in the app that requires refs to buttons. Once we refactor this component, we can remove forwardRef from buttons
  const prevArrowRef = useRef<HTMLButtonElement>(null)
  const nextArrowRef = useRef<HTMLButtonElement>(null)
  const carouselRef = useRef<ImperativeHandleData>(null)
  return (
    <Container className={className}>
      <GridHeadingContainer>
        <TitleContainer>
          {title && <Text variant="h4">{title}</Text>}
          {seeAllUrl && (
            <SeeAllLink
              iconPlacement="left"
              icon={<SvgPlayerPlay width={16} height={16} />}
              textOnly
              to={seeAllUrl}
              size="large"
              variant="primary"
            >
              See all
            </SeeAllLink>
          )}
          <CarouselArrowsContainer>
            <Arrow {...carouselRef.current?.getPrevArrowProps()} ref={prevArrowRef} size="large" variant="secondary">
              <SvgGlyphChevronLeft />
            </Arrow>
            <Arrow {...carouselRef.current?.getNextArrowProps()} ref={nextArrowRef} size="large" variant="secondary">
              <SvgGlyphChevronRight />
            </Arrow>
          </CarouselArrowsContainer>
        </TitleContainer>
      </GridHeadingContainer>
      <Carousel
        {...carouselProps}
        prevArrowRef={prevArrowRef}
        nextArrowRef={nextArrowRef}
        ref={carouselRef}
        itemWidth={350}
      />
    </Container>
  )
}
