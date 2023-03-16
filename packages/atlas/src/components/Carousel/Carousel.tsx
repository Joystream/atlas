import { ReactNode, useEffect, useMemo, useState } from 'react'

import { Dots } from '@/components/Carousel/Carousel.styles'
import { GliderProps, useGlider } from '@/components/Glider'

export type CarouselProps = {
  className?: string
  arrowPosition?: number
  dotsVisible?: boolean
  children: ((props: ReturnType<typeof useGlider>) => ReactNode[]) | ReactNode[]
} & GliderProps

export type CarouselRef = {
  getPrevArrowProps: ReturnType<typeof useGlider>['getPrevArrowProps']
  getNextArrowProps: ReturnType<typeof useGlider>['getNextArrowProps']
}

export const Carousel = ({ children, className = '', arrowPosition, dotsVisible, ...gliderOptions }: CarouselProps) => {
  const [currentMiddleItem, setCurrentMiddleItem] = useState(0)
  const gliderProps = useGlider<HTMLDivElement>({
    onSwipeEnd: ({ index }) => setCurrentMiddleItem(index),
    type: 'slider',
    perSwipe: '|',
    ...gliderOptions,
  })
  const { ref: gliderRef, getContainerProps, getGliderProps, getTrackProps } = gliderProps
  const content = typeof children === 'function' ? children(gliderProps) : children

  useEffect(() => {
    gliderProps.glider?.update()
    // glider needs to recalc when number of children changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content.length])

  const dots = useMemo(() => {
    const { perView } = gliderOptions
    if (perView && dotsVisible) {
      const numberOfDots = Math.ceil(content?.length / perView)
      return Array.from({ length: numberOfDots }, (_, idx) => (
        <button
          key={idx}
          className={`glide__bullet glider-dot ${Math.ceil(currentMiddleItem / perView) === idx && 'active'}`}
          data-glide-dir={`=${idx * (gliderOptions.perView ?? 1)}`}
        />
      ))
    }
    return null
  }, [content?.length, currentMiddleItem, dotsVisible, gliderOptions])

  return (
    <div ref={gliderRef} {...getGliderProps({ className })}>
      <div {...getTrackProps()} data-glide-el="track">
        <div {...getContainerProps()}>{content}</div>
      </div>
      {dotsVisible && (
        <Dots className="glide__bullets" data-glide-el="controls[nav]">
          {dots}
        </Dots>
      )}
    </div>
  )
}
