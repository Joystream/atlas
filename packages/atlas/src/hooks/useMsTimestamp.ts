import { useEffect, useState } from 'react'

export const useMsTimestamp = () => {
  const [timestamp, setTimestamp] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return timestamp
}
