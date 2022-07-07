import { useEffect, useState } from 'react'

import { useRouterQuery } from '@/hooks/useRouterQuery'

export const useVideoStartTimestamp = (duration?: number | null, savedVideoTimeStamp?: number) => {
  const [startTimestamp, setStartTimestamp] = useState<number>()
  const timestampFromQuery = Number(useRouterQuery('time'))

  useEffect(() => {
    if (!timestampFromQuery || timestampFromQuery > (duration ?? 0)) {
      return
    }
    if (savedVideoTimeStamp && !timestampFromQuery && savedVideoTimeStamp < (duration ?? 0)) {
      setStartTimestamp(savedVideoTimeStamp)
      return
    }
    setStartTimestamp(timestampFromQuery)
  }, [duration, savedVideoTimeStamp, timestampFromQuery])

  return startTimestamp
}
