import { useLayoutEffect, useState } from 'react'

type CallbackArg = {
  hasOverflow: boolean
  clientWidth: number | undefined
  scrollWidth: number | undefined
}

type UseIsOverflowOpts = {
  ref: React.RefObject<HTMLElement | null>
  callback?: (arg: CallbackArg) => void
  disabled?: boolean
}

export const useIsOverflow = ({ ref, callback, disabled }: UseIsOverflowOpts) => {
  const [isOverflow, setIsOverflow] = useState<boolean>()
  const [clientWidth, setClientWidth] = useState<number>()
  const [scrollWidth, setScrollWidth] = useState<number>()
  const [domRect, setDomRect] = useState<DOMRect>()

  useLayoutEffect(() => {
    if (disabled) {
      return
    }
    const el = ref.current
    if (!el) {
      return
    }

    const trigger = () => {
      const hasOverflow = el.scrollWidth > el.clientWidth
      setClientWidth(el.clientWidth)
      setIsOverflow(hasOverflow)
      setScrollWidth(el.scrollWidth)
      setDomRect(el.getBoundingClientRect())

      if (callback) callback({ hasOverflow, clientWidth: el.clientWidth, scrollWidth: el.scrollWidth })
    }

    let resizeObserver: ResizeObserver
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(trigger)
      resizeObserver.observe(el)
    }

    trigger()
    return () => {
      if ('ResizeObserver' in window) {
        resizeObserver.unobserve(el)
        resizeObserver.disconnect()
      }
    }
  }, [callback, disabled, ref])

  return { isOverflow, clientWidth, scrollWidth, domRect }
}
