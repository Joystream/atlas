import { ReactNode } from 'react'
import { Pagination } from 'swiper'
import 'swiper/css'
import { SwiperProps } from 'swiper/react'
import { Swiper as SwiperType } from 'swiper/types'

import { StyledSwiper, StyledSwiperSlide } from '@/components/Carousel/Carousel.styles'

export type SwiperInstance = SwiperType
export type CarouselProps = {
  className?: string
  dotsVisible?: boolean
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
  spaceBetween = 12,
  minSlideWidth,
  ...swiperOptions
}: CarouselProps) => {
  return (
    <StyledSwiper
      navigation
      minSlideWidth={minSlideWidth}
      {...(dotsVisible ? dotsProps : {})}
      {...swiperOptions}
      spaceBetween={spaceBetween}
    >
      {children?.map((child, idx) => (
        <StyledSwiperSlide key={idx}>{child}</StyledSwiperSlide>
      ))}
    </StyledSwiper>
  )
}
