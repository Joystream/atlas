import { differenceInSeconds, format } from 'date-fns'
import { useLayoutEffect, useState } from 'react'

import { formatDurationShort } from '@/utils/time'

export const DIFF_THRESHOLD = 3600

export const useTimer = (date?: Date | number) => {
  const [timeLeft, setTimeLeft] = useState<string | null>(null)
  const [type, setType] = useState<'countdown' | 'date'>()
  const dateTime = typeof date === 'number' ? date : date?.getTime()
  useLayoutEffect(() => {
    if (date) {
      const timeDiffInSeconds = differenceInSeconds(date, new Date())
      if (timeDiffInSeconds > 0 && timeDiffInSeconds < DIFF_THRESHOLD) {
        setType('countdown')
        const interval = setInterval(() => {
          const timeDiffInSeconds = differenceInSeconds(date, new Date())
          if (timeDiffInSeconds < 0) {
            setType('date')
            setTimeLeft(`${format(date, 'd MMM')} at ${format(date, 'HH:mm')}`)
            clearInterval(interval)
            return
          }
          setTimeLeft(formatDurationShort(Math.abs(timeDiffInSeconds)))
        }, 1000)

        return () => {
          clearInterval(interval)
        }
      } else {
        setType('date')
        setTimeLeft(`${format(date, 'd MMM')} at ${format(date, 'HH:mm')}`)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateTime])

  return [timeLeft, type]
}
