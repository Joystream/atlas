import { useEffect, useRef } from 'react'

export * from './usePersonalData'

type Callback = (...args: unknown[]) => void
export const useInterval = (cb: Callback, delay = 1000) => {
  const savedCallback = useRef<Callback>()

  useEffect(() => {
    savedCallback.current = cb
  }, [cb])

  useEffect(() => {
    if (savedCallback.current) {
      const id = setInterval(() => savedCallback.current!(), delay)
      return () => clearInterval(id)
    }
  }, [delay])
}
