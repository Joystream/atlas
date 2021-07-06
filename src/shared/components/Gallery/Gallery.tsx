import React, { ComponentProps, useRef } from 'react'

import { Arrow } from '@/shared/components/Carousel/Carousel.style'
import { SvgGlyphChevronLeft, SvgGlyphChevronRight } from '@/shared/icons'

import { CarouselArrowsContainer, Container, HeadingContainer } from './Gallery.style'

import { Carousel, CarouselProps } from '../Carousel/Carousel'
import { Text } from '../Text'

export type GalleryProps = {
  title?: string
  className?: string
} & CarouselProps

type ImperativeHandleData = {
  getPrevArrowProps: () => ComponentProps<typeof Arrow>
  getNextArrowProps: () => ComponentProps<typeof Arrow>
}

export const Gallery: React.FC<GalleryProps> = ({ title, className, ...carouselProps }) => {
  // TODO: this is the only place in the app that requires refs to buttons. Once we refactor this component, we can remove forwardRef from buttons
  const prevArrowRef = useRef<HTMLButtonElement>(null)
  const nextArrowRef = useRef<HTMLButtonElement>(null)
  const carouselRef = useRef<ImperativeHandleData>(null)
  return (
    <Container className={className}>
      <HeadingContainer>
        {title && <Text variant="h4">{title}</Text>}
        <CarouselArrowsContainer>
          <Arrow {...carouselRef.current?.getPrevArrowProps()} ref={prevArrowRef} size="large" variant="secondary">
            <SvgGlyphChevronLeft />
          </Arrow>
          <Arrow {...carouselRef.current?.getNextArrowProps()} ref={nextArrowRef} size="large" variant="secondary">
            <SvgGlyphChevronRight />
          </Arrow>
        </CarouselArrowsContainer>
      </HeadingContainer>
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
