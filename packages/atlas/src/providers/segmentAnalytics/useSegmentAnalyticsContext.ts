import { useContext } from 'react'

import { SegmentAnalyticsContext } from './segment.provider'

export const useSegmentAnalyticsContext = () => {
  const ctx = useContext(SegmentAnalyticsContext)

  if (!ctx) throw new Error('useSegmentAnalyticsContext must be used within SegmentAnalyticsContext')

  return ctx
}
