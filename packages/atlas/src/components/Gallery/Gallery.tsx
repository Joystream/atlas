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
  children: ReactNode[] | ReactNode
}> &
  Omit<CarouselProps, 'children'>

export const Gallery: FC<GalleryProps> = ({ title, className, seeAllUrl, children, ...carouselProps }) => {
  // TODO: this is the only place in the app that requires refs to buttons. Once we refactor this component, we can remove forwardRef from buttons
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
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/*@ts-ignore*/}
        {({ glider }) => {
          gliderRef.current = glider

          return children
        }}
      </Carousel>
    </Container>
  )
}
