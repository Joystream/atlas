import { useEffect, useState } from 'react'

export const useVideoStartTimestamp = (timestampFromQuery: number, duration?: number | null) => {
  const [startTimestamp, setStartTimestamp] = useState<number>()

  useEffect(() => {
    if (!timestampFromQuery || timestampFromQuery > (duration ?? 0)) {
      return
    }
    setStartTimestamp(timestampFromQuery)
  }, [duration, timestampFromQuery])

  return { startTimestamp, setStartTimestamp }
}
