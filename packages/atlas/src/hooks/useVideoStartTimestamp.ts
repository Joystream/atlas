import { useEffect, useState } from 'react'

import { useRouterQuery } from '@/hooks/useRouterQuery'

export const useVideoStartTimestamp = (duration?: number | null) => {
  const [startTimestamp, setStartTimestamp] = useState<number>()
  const timestampFromQuery = Number(useRouterQuery('time'))

  useEffect(() => {
    if (!timestampFromQuery || timestampFromQuery > (duration ?? 0)) {
      return
    }
    setStartTimestamp(timestampFromQuery)
  }, [duration, timestampFromQuery])

  return { startTimestamp, setStartTimestamp }
}
