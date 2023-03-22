import { ReactElement, useRef } from 'react'

import { Carousel, CarouselProps, CarouselRef } from '@/components/Carousel'
import { GridWrapper } from '@/components/Section/components/SectionContent/SectionContent.styles'

type SectionGridTypeProps = {
  type: 'grid'
  minChildrenWidth: number
}

type SectionCarouselTypeProps = {
  type: 'carousel'
} & CarouselProps

type SectionContentTypes = SectionGridTypeProps | SectionCarouselTypeProps

export type SectionContentProps = {
  className?: string
  children: ReactElement[]
} & SectionContentTypes

export const SectionContent = (props: SectionContentProps) => {
  const prevArrowRef = useRef<HTMLButtonElement>(null)
  const nextArrowRef = useRef<HTMLButtonElement>(null)
  const carouselRef = useRef<CarouselRef>(null)

  if (props.type === 'grid') {
    return (
      <GridWrapper className={props.className} minWidth={props.minChildrenWidth}>
        {props.children}
      </GridWrapper>
    )
  }

  // todo: replace with new carousel when implemented by #3775
  return (
    <Carousel {...props} scrollLock prevArrowRef={prevArrowRef} nextArrowRef={nextArrowRef} ref={carouselRef}>
      {props.children}
    </Carousel>
  )
}
