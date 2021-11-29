import Glider from 'glider-js'
import React, {
  ComponentPropsWithoutRef,
  ReactNode,
  RefObject,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'

import { GliderProps, useGlider } from '@/components/Glider'

import { Container, Dots, GliderContainer, Track } from './Carousel.styles'

export type CarouselProps = {
  className?: string
  arrowPosition?: number
  dotsVisible?: boolean
} & GliderProps
export const Carousel = forwardRef<
  ReactNode,
  CarouselProps &
    ComponentPropsWithoutRef<'div'> & {
      prevArrowRef: RefObject<HTMLButtonElement>
      nextArrowRef: RefObject<HTMLButtonElement>
    }
>(
  (
    {
      children,
      className = '',
      arrowPosition,
      slidesToShow = 'auto',
      dotsVisible,
      prevArrowRef,
      nextArrowRef,
      ...gliderOptions
    },
    ref
  ) => {
    const dotsRef = useRef<HTMLDivElement>(null)
    const gliderInstanceRef = useRef<Glider.Static<HTMLElement>>()
    const slidesToScrollRef = useRef<number>(0)

    const onAnimated = () => {
      if (gliderInstanceRef.current && gliderOptions.responsive) {
        const breakpointIndex = gliderOptions.responsive.findIndex(
          (item) => item.breakpoint === gliderInstanceRef.current?.breakpoint
        )
        const slidesToScroll = gliderOptions.responsive[breakpointIndex].settings.slidesToScroll as number
        const itemsRemainder = gliderInstanceRef.current.slides.length % slidesToScrollRef.current || slidesToScroll
        if (nextArrowRef.current && nextArrowRef.current?.classList.contains('disabled') && itemsRemainder) {
          gliderInstanceRef.current.setOption({ slidesToScroll: itemsRemainder }, false)
        } else {
          gliderInstanceRef.current.setOption({ slidesToScroll: slidesToScrollRef.current || slidesToScroll }, false)
          if (!slidesToScrollRef.current) {
            slidesToScrollRef.current = slidesToScroll
          }
        }
      }
    }

    const {
      ref: gliderRef,
      getContainerProps,
      getGliderProps,
      getTrackProps,
      getPrevArrowProps,
      getNextArrowProps,
      getDotsProps,
      glider,
    } = useGlider<HTMLDivElement>({
      slidesToShow,
      onAnimated,
      arrows: { prev: prevArrowRef.current, next: nextArrowRef.current },
      dots: dotsRef.current,
      ...gliderOptions,
    })

    const resetSlidesToScroll = () => {
      slidesToScrollRef.current = 0
    }

    useEffect(() => {
      window.addEventListener('resize', resetSlidesToScroll)

      return () => {
        window.removeEventListener('resize', resetSlidesToScroll)
      }
    }, [])

    useEffect(() => {
      if (!glider) return
      gliderInstanceRef.current = glider
    }, [glider])

    useImperativeHandle(ref, () => ({
      getPrevArrowProps,
      getNextArrowProps,
    }))
    return (
      <Container {...getContainerProps({ className })}>
        <GliderContainer {...getGliderProps()} ref={gliderRef}>
          <Track {...getTrackProps()}>{children}</Track>
        </GliderContainer>
        {dotsVisible && <Dots {...getDotsProps()} ref={dotsRef} />}
      </Container>
    )
  }
)
Carousel.displayName = 'Carousel'
