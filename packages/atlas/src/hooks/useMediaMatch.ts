import { useCallback, useEffect, useState } from 'react'

import { breakpoints } from '@/styles'

export const useMediaMatch = (breakpoint: keyof typeof breakpoints) => {
  const mediaString = `screen and (min-width: ${breakpoints[breakpoint]})`
  const mediaQuery = window.matchMedia(mediaString)
  const [match, setMatch] = useState(mediaQuery.matches)

  const handleChange = useCallback((event: MediaQueryListEvent) => {
    setMatch(event.matches)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia(mediaString)
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [handleChange, mediaString])

  return match
}
