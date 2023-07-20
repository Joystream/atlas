import { AnalyticsBrowser } from '@segment/analytics-next'
import { FC, ReactNode, createContext, useMemo } from 'react'

import { atlasConfig } from '@/config'
import { BUILD_ENV } from '@/config/env'
import { usePersonalDataStore } from '@/providers/personalData'

import { AnalyticsContextProps } from './segment.types'

interface AnalyticsProviderProps {
  children: ReactNode
}
export const SegmentAnalyticsContext = createContext<undefined | AnalyticsContextProps>(undefined)

export const SegmentAnalyticsProvider: FC<AnalyticsProviderProps> = ({ children }) => {
  const cookiesAccepted = usePersonalDataStore((state) => state.cookiesAccepted)
  const analyticsEnabled = BUILD_ENV === 'production' && cookiesAccepted
  const writeKey = (analyticsEnabled && atlasConfig.analytics.segment?.id) || ''

  const segmentAnalytics: AnalyticsContextProps = useMemo(
    () => ({ analytics: writeKey ? AnalyticsBrowser.load({ writeKey }) : new AnalyticsBrowser() }),
    [writeKey]
  )

  return <SegmentAnalyticsContext.Provider value={segmentAnalytics}>{children}</SegmentAnalyticsContext.Provider>
}
