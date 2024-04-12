import { useCallback, useEffect, useState } from 'react'

import { media } from '@/styles'

export const useIsLandscape = () => {
  const mediaQuery = window.matchMedia(media.landscape)
  const [match, setMatch] = useState(mediaQuery.matches)

  const handleChange = useCallback((event: MediaQueryListEvent) => {
    setMatch(event.matches)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia(media.landscape)
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [handleChange])

  return match
}
