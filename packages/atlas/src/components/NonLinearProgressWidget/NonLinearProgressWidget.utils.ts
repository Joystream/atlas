import { CarouselProps } from '@/components/Carousel'
import { breakpoints } from '@/styles'

export const responsive: CarouselProps['breakpoints'] = {
  [parseInt(breakpoints.xs)]: {
    slidesPerView: 1,
    slidesPerGroup: 1,
  },
  [parseInt(breakpoints.sm)]: {
    slidesPerView: 2,
    slidesPerGroup: 2,
  },
  [parseInt(breakpoints.lg)]: {
    slidesPerView: 3,
    slidesPerGroup: 3,
  },
  [parseInt(breakpoints.xl)]: {
    slidesPerView: 4,
    slidesPerGroup: 4,
  },
  [parseInt(breakpoints.xxl)]: {
    slidesPerView: 5,
    slidesPerGroup: 5,
  },
}

export const getProgressPercentage = (activeStep: number, totalStepCount: number) =>
  Math.round((activeStep / totalStepCount) * 100)
