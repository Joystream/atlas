import { useLayoutEffect, useState } from 'react'

import { breakpoints } from '@/styles'

export const useBreakpointKey = (): keyof typeof breakpoints | undefined => {
  const [windowSize, setWindowSize] = useState<keyof typeof breakpoints>()

  useLayoutEffect(() => {
    const handleWindowResize = () => {
      const windowWidth = window.innerWidth

      Object.entries(breakpoints).forEach(([key, value]) => {
        if (windowWidth >= parseInt(value)) {
          setWindowSize(key as keyof typeof breakpoints)
          return
        }
      })
    }
    handleWindowResize()

    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  return windowSize
}
