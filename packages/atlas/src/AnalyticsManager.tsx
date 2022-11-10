import ls from '@livesession/sdk'
import { FC, useCallback, useEffect } from 'react'

import { atlasConfig } from '@/config'
import { BUILD_ENV } from '@/config/env'
import { usePersonalDataStore } from '@/providers/personalData'

export const AnalyticsManager: FC = () => {
  const cookiesAccepted = usePersonalDataStore((state) => state.cookiesAccepted)
  const analyticsEnabled = BUILD_ENV === 'production' && cookiesAccepted

  const initUsersnap = useCallback(() => {
    if (!atlasConfig.analytics.usersnap?.id) return

    // @ts-ignore custom prop required by usersnap
    window.onUsersnapCXLoad = function (api) {
      api.init()
      // @ts-ignore custom prop required by usersnap
      window.Usersnap = api
    }
    const script = document.createElement('script')
    script.defer = true
    script.src = `https://widget.usersnap.com/global/load/${atlasConfig.analytics.usersnap.id}?onload=onUsersnapCXLoad`
    document.getElementsByTagName('head')[0].appendChild(script)
  }, [])

  const initLiveSession = useCallback(() => {
    if (!atlasConfig.analytics.livesession?.id) return

    ls.init(atlasConfig.analytics.livesession.id, {
      keystrokes: true,
      rootHostname: atlasConfig.analytics.livesession.rootHostname,
    })
    ls.newPageView()
  }, [])

  // initialize livesession
  useEffect(() => {
    if (!analyticsEnabled) return

    initLiveSession()
  }, [analyticsEnabled, initLiveSession])

  // initialize usersnap
  useEffect(() => {
    if (!analyticsEnabled) return

    initUsersnap()
  }, [analyticsEnabled, initUsersnap])

  return null
}
