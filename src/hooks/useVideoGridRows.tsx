import { useEffect, useState } from 'react'

import { useMediaMatch } from '@/hooks/useMediaMatch'

type UseVideoGridRowsArgs = 'videos' | 'videosInChannel'

export const useVideoGridRows = (variant: UseVideoGridRowsArgs = 'videos') => {
  const [videoRows, setVideoRows] = useState<number | null>(null)
  const mdMatch = useMediaMatch('md')
  const smMatch = useMediaMatch('sm')
  const xsMatch = useMediaMatch('xs')

  useEffect(() => {
    if (mdMatch) {
      setVideoRows(variant === 'videos' ? 2 : 1)
      return
    }
    if (smMatch) {
      setVideoRows(variant === 'videos' ? 3 : 2)
      return
    }
    if (variant !== 'videos') {
      setVideoRows(3)
      return
    }
    if (xsMatch) {
      setVideoRows(4)
      return
    }
    setVideoRows(6)
  }, [mdMatch, smMatch, variant, xsMatch])

  return videoRows || (variant === 'videos' ? 2 : 1)
}
