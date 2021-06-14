import React from 'react'

import { Container, HeadingContainer } from './Gallery.style'

import Carousel, { CarouselProps } from '../Carousel/Carousel'
import Text from '../Text'

export type GalleryProps = {
  title?: string
  className?: string
} & CarouselProps

export const Gallery: React.FC<GalleryProps> = ({ title, className, ...carouselProps }) => {
  return (
    <Container className={className}>
      {title && (
        <HeadingContainer>
          <Text variant="h5">{title}</Text>
        </HeadingContainer>
      )}
      <Carousel {...carouselProps} />
    </Container>
  )
}
