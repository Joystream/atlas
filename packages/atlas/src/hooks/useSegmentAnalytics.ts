import { useCallback } from 'react'

import useSegmentAnalyticsContext from '@/providers/segmentAnalytics/useSegmentAnalyticsContext'

const useAnalytics = () => {
  const { analytics } = useSegmentAnalyticsContext()

  const pageViewed = useCallback(
    (name: string, category = 'App') => {
      analytics.page(category, name)
    },
    [analytics]
  )

  return {
    pageViewed,
  }
}

export default useAnalytics
