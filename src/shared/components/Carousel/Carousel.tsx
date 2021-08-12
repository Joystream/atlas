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

import { Container, Dots, GliderContainer, Track } from './Carousel.style'

import { GliderProps, useGlider } from '../Glider'

export type CarouselProps = {
  paddingLeft?: number
  paddingTop?: number
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
      paddingLeft = 0,
      paddingTop = 0,
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

    const onAnimated = () => {
      if (gliderInstanceRef.current && gliderOptions.responsive) {
        const breakpointIndex = gliderOptions.responsive.findIndex(
          (item) => item.breakpoint === gliderInstanceRef.current?.breakpoint
        )
        const slidesToScroll = gliderOptions.responsive[breakpointIndex].settings.slidesToScroll as number
        const itemsRemainder = gliderInstanceRef.current.slides.length % slidesToScroll
        if (nextArrowRef.current && nextArrowRef.current?.classList.contains('disabled') && itemsRemainder) {
          gliderInstanceRef.current.setOption({ slidesToScroll: 2 }, false)
        } else {
          gliderInstanceRef.current.setOption({ skipTrack: true, ...gliderOptions }, false)
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
        <GliderContainer {...getGliderProps()} paddingLeft={paddingLeft} paddingTop={paddingTop} ref={gliderRef}>
          <Track {...getTrackProps()}>{children}</Track>
        </GliderContainer>
        {dotsVisible && <Dots {...getDotsProps()} ref={dotsRef} />}
      </Container>
    )
  }
)
