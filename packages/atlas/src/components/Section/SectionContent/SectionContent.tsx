import { FC, ReactElement } from 'react'

import { Carousel, CarouselProps } from '@/components/Carousel'
import { GridWrapper, GridWrapperProps } from '@/components/Section/SectionContent/SectionContent.styles'

type SectionGridTypeProps = {
  type: 'grid'
} & GridWrapperProps

type SectionCarouselTypeProps = {
  type: 'carousel'
} & CarouselProps

type SectionContentTypes = SectionGridTypeProps | SectionCarouselTypeProps

export type SectionContentProps = {
  className?: string
  children: ReactElement[]
} & SectionContentTypes

export const SectionContent: FC<SectionContentProps> = (props) => {
  if (props.type === 'grid') {
    return <GridWrapper {...props}>{props.children}</GridWrapper>
  }

  return <Carousel {...props}>{props.children}</Carousel>
}
