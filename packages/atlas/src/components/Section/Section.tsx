import { FC, PropsWithChildren, useEffect, useState } from 'react'
import Swiper, { Controller } from 'swiper'

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
  const [glider, setGlider] = useState<SwiperInstance>()
  const [isCarouselEnd, setIsCarouselEnd] = useState(false)
  const [isCarouselBeginning, setIsCarouselBeginning] = useState(true)

  const handleSlideLeft = () => {
    glider?.slidePrev()
  }
  const handleSlideRight = () => {
    glider?.slideNext()
  }

  useEffect(() => {
    const handler = (slider: Swiper) => {
      setIsCarouselBeginning(slider.isBeginning)
      setIsCarouselEnd(slider.isEnd)
    }
    glider?.on('slideChange', handler)

    return () => {
      glider?.off('slideChange', handler)
    }
  }, [glider])

  return (
    <SectionWrapper className={className}>
      {isCarousel ? (
        <SectionHeader
          {...headerProps}
          isBeginning={isCarouselBeginning}
          isEnd={isCarouselEnd}
          isCarousel
          onMoveCarouselLeft={handleSlideLeft}
          onMoveCarouselRight={handleSlideRight}
        />
      ) : (
        <SectionHeader {...headerProps} />
      )}
      {isCarousel ? (
        <SectionContent
          {...contentProps}
          modules={[Controller]}
          controller={{ control: glider }}
          onSwiper={setGlider}
        />
      ) : (
        <SectionContent {...contentProps} />
      )}
      {footerProps && <SectionFooter {...footerProps} />}
    </SectionWrapper>
  )
}
