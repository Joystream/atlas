import { useEffect, useRef, useState } from 'react'
import Swiper from 'swiper'

import { SectionWrapper } from './Section.styles'
import { SectionContent, SectionContentProps } from './SectionContent'
import { SectionFooter, SectionFooterProps } from './SectionFooter'
import { SectionHeader, SectionHeaderProps } from './SectionHeader'

import { SwiperInstance } from '../Carousel'

export type SectionProps<T> = {
  headerProps?: Omit<SectionHeaderProps<T>, 'isCarousel'>
  contentProps: SectionContentProps
  footerProps?: SectionFooterProps
  className?: string
  withoutGap?: boolean
}

export function Section<T>({ headerProps, contentProps, footerProps, className, withoutGap }: SectionProps<T>) {
  const isCarousel = contentProps.type === 'carousel'
  const [isCarouselEnd, setIsCarouselEnd] = useState(false)
  const [isCarouselBeginning, setIsCarouselBeginning] = useState(true)

  const gliderRef = useRef<SwiperInstance>()

  const handleSlideLeft = () => {
    gliderRef.current?.slidePrev()
  }
  const handleSlideRight = () => {
    gliderRef.current?.slideNext()
  }

  useEffect(() => {
    const handler = (slider: Swiper) => {
      setIsCarouselBeginning(slider.isBeginning)
      setIsCarouselEnd(slider.isEnd)
    }
    gliderRef.current?.on('slideChange', handler)
    gliderRef.current?.on('resize', handler)
    gliderRef.current?.on('update', handler)

    return () => {
      gliderRef.current?.off('slideChange', handler)
      gliderRef.current?.off('resize', handler)
      gliderRef.current?.off('update', handler)
    }
  }, [])

  return (
    <SectionWrapper withoutGap={withoutGap} className={className}>
      {headerProps &&
        (isCarousel ? (
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
        ))}
      {isCarousel ? (
        contentProps.children.length > 0 && (
          <SectionContent {...contentProps} onSwiper={(swiper) => (gliderRef.current = swiper)} />
        )
      ) : (
        <SectionContent {...contentProps} />
      )}
      {footerProps && <SectionFooter {...footerProps} />}
    </SectionWrapper>
  )
}
