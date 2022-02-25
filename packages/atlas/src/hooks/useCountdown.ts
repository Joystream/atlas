import { useEffect, useState } from 'react'

import Timeout = NodeJS.Timeout

export const useCountdown = (seconds?: number) => {
  const [timeLeft, setTimeLeft] = useState<number | undefined>()

  useEffect(() => {
    if (seconds) {
      setTimeLeft(seconds)
    }
  }, [seconds])

  useEffect(() => {
    let interval: Timeout
    if (seconds) {
      interval = setInterval(() => {
        setTimeLeft((prevState) => {
          if (prevState && prevState > 0) {
            return prevState - 1
          }
          return 0
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [seconds, timeLeft])

  return timeLeft
}
