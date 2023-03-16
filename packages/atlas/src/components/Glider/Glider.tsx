import Glider, { Options } from '@glidejs/glide'
import '@glidejs/glide/dist/css/glide.core.min.css'
import { useRef, useState } from 'react'

import { useMountEffect } from '@/hooks/useMountEffect'

type GliderEventListeners = {
  onSwipeEnd?: (glide: Glider) => void
}

export type GliderProps = Partial<Options> &
  GliderEventListeners & {
    responsive?: Record<number, Partial<Options>>
  }

type PropsWithClassName<T> = {
  className?: string
} & T
function getPropsFor(name: string) {
  return function <T>({ className, ...otherProps }: PropsWithClassName<T> = {} as PropsWithClassName<T>) {
    return { className: `${className ? `${className} ` : ''}${name}`, ...otherProps }
  }
}
const getGliderProps = getPropsFor('glide')
const getTrackProps = getPropsFor('glide__track')
const getNextArrowProps = getPropsFor('glide__arrow glide__arrow--right')
const getPrevArrowProps = getPropsFor('glide__arrow glide__arrow--left')
const getContainerProps = getPropsFor('glide__slides')
const getItemProps = getPropsFor('glide__slide')

export function useGlider<T extends HTMLElement>({ onSwipeEnd, responsive, ...gliderOptions }: GliderProps) {
  const [glider, setGlider] = useState<Glider>()
  const element = useRef<T>(null)

  useMountEffect(() => {
    if (!element.current) {
      return
    }
    const newGlider = new Glider(element.current, { type: 'carousel', breakpoints: responsive, ...gliderOptions })
    newGlider.on('run.after', () => {
      onSwipeEnd?.(newGlider)
    })
    newGlider.mount()
    setGlider(newGlider)

    return () => {
      if (newGlider) {
        newGlider.destroy()
      }
    }
  })

  return {
    ref: element,
    glider,
    getGliderProps,
    getTrackProps,
    getNextArrowProps,
    getPrevArrowProps,
    getContainerProps,
    getItemProps,
  }
}
