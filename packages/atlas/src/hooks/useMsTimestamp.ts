import { useEffect, useState } from 'react'

type UseMsTimestampOpts = {
  shouldStop?: boolean
}

export const useMsTimestamp = (opts?: UseMsTimestampOpts) => {
  const [timestamp, setTimestamp] = useState(Date.now())

  useEffect(() => {
    if (opts?.shouldStop) {
      return
    }
    const interval = setInterval(() => {
      setTimestamp(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [opts?.shouldStop])

  return timestamp
}
