import { FC, ReactElement } from 'react'

import { Carousel, CarouselProps } from '@/components/Carousel'
import { GridWrapper } from '@/components/Section/SectionContent/SectionContent.styles'

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

export const SectionContent: FC<SectionContentProps> = (props) => {
  if (props.type === 'grid') {
    return (
      <GridWrapper className={props.className} minWidth={props.minChildrenWidth}>
        {props.children}
      </GridWrapper>
    )
  }

  return <Carousel {...props}>{props.children}</Carousel>
}
