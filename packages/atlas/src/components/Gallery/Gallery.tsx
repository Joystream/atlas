import Glider from '@glidejs/glide'
import { FC, PropsWithChildren, ReactNode, useRef } from 'react'

import { SvgActionChevronL, SvgActionChevronR, SvgControlsPlay } from '@/assets/icons'
import { Carousel, CarouselProps } from '@/components/Carousel'
import { Arrow } from '@/components/Carousel/Carousel.styles'
import { GridHeadingContainer, TitleContainer } from '@/components/GridHeading'
import { Text } from '@/components/Text'

import { CarouselArrowsContainer, Container, SeeAllLink } from './Gallery.styles'

export type GalleryProps = PropsWithChildren<{
  title?: string
  className?: string
  seeAllUrl?: string
  children: ReactNode[]
}> &
  Omit<CarouselProps, 'children'>

export const Gallery: FC<GalleryProps> = ({ title, className, seeAllUrl, children, ...carouselProps }) => {
  const gliderRef = useRef<Glider | undefined>(undefined)
  return (
    <Container className={className}>
      <GridHeadingContainer>
        <TitleContainer>
          {title && (
            <Text as="h2" variant="h500">
              {title}
            </Text>
          )}
          {seeAllUrl && (
            <SeeAllLink
              iconPlacement="left"
              icon={<SvgControlsPlay width={16} height={16} />}
              to={seeAllUrl}
              size="large"
              variant="primary"
            >
              See all
            </SeeAllLink>
          )}
          <CarouselArrowsContainer>
            <Arrow
              icon={<SvgActionChevronL />}
              size="large"
              variant="secondary"
              onClick={() => gliderRef.current?.go('<')}
            />
            <Arrow
              icon={<SvgActionChevronR />}
              size="large"
              variant="secondary"
              onClick={() => gliderRef.current?.go('>')}
            />
          </CarouselArrowsContainer>
        </TitleContainer>
      </GridHeadingContainer>
      <Carousel {...carouselProps}>
        {({ glider }) => {
          gliderRef.current = glider

          return children
        }}
      </Carousel>
    </Container>
  )
}
