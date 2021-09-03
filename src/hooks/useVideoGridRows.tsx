import { useEffect, useState } from 'react'

import { useMediaMatch } from '@/hooks/useMediaMatch'

type VideoGridRowsVariant = 'videos' | 'videosInChannel' | 'channel'

export const useVideoGridRows = (variant: VideoGridRowsVariant = 'videos') => {
  const [videoRows, setVideoRows] = useState<number | null>(null)
  const mdMatch = useMediaMatch('md')
  const smMatch = useMediaMatch('sm')
  const xsMatch = useMediaMatch('xs')

  useEffect(() => {
    if (mdMatch) {
      setVideoRows(() => {
        if (variant === 'channel') {
          return 4
        }
        if (variant === 'videos') {
          return 2
        }
        return 1
      })
      return
    }
    if (smMatch) {
      setVideoRows(() => {
        if (variant === 'videos') {
          return 3
        }
        if (variant === 'channel') {
          return 6
        }
        return 2
      })
      return
    }
    if (variant !== 'videos' && variant !== 'channel') {
      setVideoRows(3)
      return
    }
    if (xsMatch) {
      setVideoRows(variant === 'channel' ? 8 : 4)
      return
    }
    setVideoRows(variant === 'channel' ? 10 : 6)
  }, [mdMatch, smMatch, variant, xsMatch])

  return videoRows || (variant === 'videos' ? 2 : 1)
}
