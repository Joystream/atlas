import { ReactNode, useMemo, useRef } from 'react'
import { Pagination } from 'swiper'
import 'swiper/css'
import { SwiperProps, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperType } from 'swiper/types'

import { StyledSwiper } from '@/components/Carousel/Carousel.styles'
import { useIsOverflow } from '@/hooks/useIsOverflow'

export type SwiperInstance = SwiperType
export type CarouselProps = {
  className?: string
  dotsVisible?: boolean
  canOverflowContainer?: boolean
  minSlideWidth?: number
  children: ReactNode[]
} & SwiperProps

const dotsProps = {
  modules: [Pagination],
  pagination: {
    clickable: true,
    bulletClass: 'bullet',
    bulletActiveClass: 'active',
  },
}

export const Carousel = ({
  children,
  dotsVisible,
  canOverflowContainer,
  spaceBetween = 12,
  minSlideWidth,
  ...swiperOptions
}: CarouselProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const { domRect, isOverflow } = useIsOverflow({ ref: wrapperRef, disabled: !canOverflowContainer })

  const paddingRight = useMemo(() => {
    return isOverflow ? document.body.clientWidth - (domRect?.right || 0) + 8 : undefined
  }, [domRect?.right, isOverflow])

  const marginLeft = useMemo(() => {
    return isOverflow ? (domRect?.x || 0) * -1 : 'unset'
  }, [domRect?.x, isOverflow])

  const paddingLeft = useMemo(() => {
    return isOverflow ? domRect?.x : 'unset'
  }, [domRect?.x, isOverflow])

  return (
    <div ref={wrapperRef}>
      <StyledSwiper
        navigation
        minSlideWidth={minSlideWidth}
        canOverflowContainer={canOverflowContainer}
        {...(dotsVisible ? dotsProps : {})}
        {...swiperOptions}
        spaceBetween={spaceBetween}
        style={{
          marginLeft,
          paddingLeft,
          paddingRight,
        }}
      >
        {children?.map((child, idx) => (
          <SwiperSlide key={idx}>{child}</SwiperSlide>
        ))}
      </StyledSwiper>
    </div>
  )
}
