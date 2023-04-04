import { ReactElement } from 'react'

import { Carousel, CarouselProps } from '@/components/Carousel'
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
  if (props.type === 'grid') {
    return (
      <GridWrapper className={props.className} minWidth={props.minChildrenWidth}>
        {props.children}
      </GridWrapper>
    )
  }

  // todo: replace with new carousel when implemented by #3775
  return <Carousel {...props}>{props.children}</Carousel>
}
