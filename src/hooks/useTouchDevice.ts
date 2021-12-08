import { useCallback, useEffect, useState } from 'react'

export const useTouchDevice = () => {
  const mediaString = `(hover: none)`
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
