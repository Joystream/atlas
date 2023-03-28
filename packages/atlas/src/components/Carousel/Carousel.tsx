import { ReactNode } from 'react'
import { Pagination } from 'swiper'
import 'swiper/css'
import { SwiperProps, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperType } from 'swiper/types'

import { StyledSwiper } from '@/components/Carousel/Carousel.styles'

export type SwiperInstance = SwiperType
export type CarouselProps = {
  className?: string
  // arrowPosition?: number
  dotsVisible?: boolean
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

export const Carousel = ({ children, dotsVisible, ...swiperOptions }: CarouselProps) => {
  return (
    <StyledSwiper navigation spaceBetween={12} {...(dotsVisible ? dotsProps : {})} {...swiperOptions}>
      {children?.map((child, idx) => (
        <SwiperSlide key={idx}>{child}</SwiperSlide>
      ))}
    </StyledSwiper>
  )
}
