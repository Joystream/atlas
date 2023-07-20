import { AnalyticsBrowser } from '@segment/analytics-next'
import { FC, ReactNode, createContext, useMemo } from 'react'

import { atlasConfig } from '@/config'
import { BUILD_ENV } from '@/config/env'
import { usePersonalDataStore } from '@/providers/personalData'

import { AnalyticsContextProps } from './segment.types'

interface AnalyticsProviderProps {
  children: ReactNode
}

const defaultAnalyticsContext = {
  analytics: null,
}

export const SegmentAnalyticsContext = createContext<AnalyticsContextProps>(defaultAnalyticsContext)

export const SegmentAnalyticsProvider: FC<AnalyticsProviderProps> = ({ children }) => {
  const cookiesAccepted = usePersonalDataStore((state) => state.cookiesAccepted)
  const analyticsEnabled = BUILD_ENV === 'production' && cookiesAccepted
  const writeKey = (analyticsEnabled && atlasConfig.analytics.segment?.id) || ''

  const segmentAnalytics: AnalyticsContextProps = useMemo(
    () => ({ analytics: writeKey ? AnalyticsBrowser.load({ writeKey }) : null }),
    [writeKey]
  )

  return <SegmentAnalyticsContext.Provider value={segmentAnalytics}>{children}</SegmentAnalyticsContext.Provider>
}
