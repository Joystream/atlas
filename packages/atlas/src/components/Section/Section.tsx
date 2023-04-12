import { FC, PropsWithChildren, useRef } from 'react'

import { SectionWrapper } from './Section.styles'
import { SectionContent, SectionContentProps } from './SectionContent'
import { SectionFooter, SectionFooterProps } from './SectionFooter'
import { SectionHeader, SectionHeaderProps } from './SectionHeader'

import { SwiperInstance } from '../Carousel'

export type SectionProps = {
  headerProps: Omit<SectionHeaderProps, 'isCarousel'>
  contentProps: SectionContentProps
  footerProps?: SectionFooterProps
  className?: string
}

export const Section: FC<PropsWithChildren<SectionProps>> = ({ headerProps, contentProps, footerProps, className }) => {
  const isCarousel = contentProps.type === 'carousel'
  const gliderRef = useRef<SwiperInstance>()

  const handleSlideLeft = () => {
    gliderRef.current?.slidePrev()
  }
  const handleSlideRight = () => {
    gliderRef.current?.slideNext()
  }
  return (
    <SectionWrapper className={className}>
      {isCarousel ? (
        <SectionHeader
          {...headerProps}
          isCarousel
          onMoveCarouselLeft={handleSlideLeft}
          onMoveCarouselRight={handleSlideRight}
        />
      ) : (
        <SectionHeader {...headerProps} />
      )}
      {isCarousel ? (
        <SectionContent {...contentProps} onSwiper={(swiper) => (gliderRef.current = swiper)} />
      ) : (
        <SectionContent {...contentProps} />
      )}
      {footerProps && <SectionFooter {...footerProps} />}
    </SectionWrapper>
  )
}
