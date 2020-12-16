import { useEffect, useRef } from 'react'

export function useInterval(callback: () => void, delay = 1000) {
  const savedCallback = useRef<() => void>()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (savedCallback.current) {
      const id = setInterval(savedCallback.current, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

export * from './usePersonalData'
