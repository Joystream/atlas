import React from 'react'
import { Container, HeadingContainer } from './Gallery.style'
import Carousel from '../Carousel'
import Text from '../Text'

type GalleryProps = {
  title?: string
  className?: string
} & React.ComponentProps<typeof Carousel>

const Gallery: React.FC<GalleryProps> = ({ title, className, ...carouselProps }) => {
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

export default Gallery
