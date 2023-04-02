import { throttle } from 'lodash-es'
import { useEffect, useLayoutEffect, useState } from 'react'
import useDraggableScroll from 'use-draggable-scroll'

type CallbackArg = {
  hasOverflow: boolean
  clientWidth: number | undefined
  scrollWidth: number | undefined
}
export const useIsOverflow = (ref: React.RefObject<HTMLElement>, callback?: (arg: CallbackArg) => void) => {
  const [isOverflow, setIsOverflow] = useState<boolean>()
  const [clientWidth, setClientWidth] = useState<number>()
  const [scrollWidth, setScrollWidth] = useState<number>()

  useLayoutEffect(() => {
    if (!ref.current) {
      return
    }

    const trigger = () => {
      if (!ref.current) {
        return
      }
      const hasOverflow = ref.current.scrollWidth > ref.current.clientWidth
      setClientWidth(ref.current.clientWidth)
      setIsOverflow(hasOverflow)
      setScrollWidth(ref.current.scrollWidth)

      if (callback)
        callback({ hasOverflow, clientWidth: ref.current.clientWidth, scrollWidth: ref.current.scrollWidth })
    }

    if (ref.current) {
      if ('ResizeObserver' in window) {
        new ResizeObserver(trigger).observe(ref.current)
      }

      trigger()
    }
  }, [callback, ref])

  return { isOverflow, clientWidth, scrollWidth }
}

const SCROLL_SHADOW_OFFSET = 10

export const useHorizonthalFade = (ref: React.RefObject<HTMLElement>) => {
  const { onMouseDown } = useDraggableScroll(ref, { direction: 'horizontal' })
  const { isOverflow } = useIsOverflow(ref)

  const [visibleShadows, setVisibleShadows] = useState({
    left: false,
    right: false,
  })

  useEffect(() => {
    if (!isOverflow) {
      setVisibleShadows({ right: false, left: false })
    }
    setVisibleShadows((prev) => ({ ...prev, right: !!isOverflow }))
  }, [isOverflow])

  useEffect(() => {
    const filterWrapper = ref.current
    if (!filterWrapper) {
      return
    }

    const touchHandler = throttle((event: Event | TouchEvent) => {
      const scrollLeft = (event.target as HTMLDivElement)?.scrollLeft
      const scrollWidth = (event.target as HTMLDivElement).scrollWidth
      const clientWidth = (event.target as HTMLDivElement).clientWidth

      setVisibleShadows({
        left: scrollLeft > SCROLL_SHADOW_OFFSET,
        right: scrollLeft < scrollWidth - clientWidth - SCROLL_SHADOW_OFFSET,
      })
    }, 100)

    filterWrapper.addEventListener('touchmove', touchHandler)
    filterWrapper.addEventListener('scroll', touchHandler)
    return () => {
      touchHandler.cancel()
      filterWrapper.removeEventListener('touchmove', touchHandler)
      filterWrapper.removeEventListener('scroll', touchHandler)
    }
  }, [ref])

  const handleArrowScroll = (direction: 'left' | 'right') => () => {
    const filterWrapper = ref.current
    if (!filterWrapper || !isOverflow) {
      return
    }

    const addition = (direction === 'left' ? -1 : 1) * (filterWrapper.clientWidth / 2)
    filterWrapper.scrollBy({ left: addition, behavior: 'smooth' })
  }

  return { handleMouseDown: onMouseDown, visibleShadows, handleArrowScroll, isOverflow }
}
