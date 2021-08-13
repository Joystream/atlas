import React, { ComponentPropsWithoutRef, ReactNode, RefObject, forwardRef, useImperativeHandle, useRef } from 'react'

import { Container, Dots, GliderContainer, Track } from './Carousel.style'

import { GliderProps, useGlider } from '../Glider'

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
    const {
      ref: gliderRef,
      getContainerProps,
      getGliderProps,
      getTrackProps,
      getPrevArrowProps,
      getNextArrowProps,
      getDotsProps,
    } = useGlider<HTMLDivElement>({
      slidesToShow,
      arrows: { prev: prevArrowRef.current, next: nextArrowRef.current },
      dots: dotsRef.current,
      ...gliderOptions,
    })

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
