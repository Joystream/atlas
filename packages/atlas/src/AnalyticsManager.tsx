import ls from '@livesession/sdk'
import React, { useCallback, useEffect } from 'react'

import { BUILD_ENV, readEnv } from '@/config/envs'
import { usePersonalDataStore } from '@/providers/personalData'

export const AnalyticsManager: React.FC = () => {
  const cookiesAccepted = usePersonalDataStore((state) => state.cookiesAccepted)
  const analyticsEnabled = BUILD_ENV === 'production' && cookiesAccepted

  const initUsersnap = useCallback(() => {
    // @ts-ignore custom prop required by usersnap
    window.onUsersnapCXLoad = function (api) {
      api.init()
      // @ts-ignore custom prop required by usersnap
      window.Usersnap = api
    }
    const script = document.createElement('script')
    script.defer = true
    script.src = `https://widget.usersnap.com/global/load/${readEnv('USERSNAP_ID')}?onload=onUsersnapCXLoad`
    document.getElementsByTagName('head')[0].appendChild(script)
  }, [])

  useEffect(() => {
    if (analyticsEnabled) {
      ls.init(readEnv('LIVESESSION_ID'), { keystrokes: true, rootHostname: '.joystream.org' })
      ls.newPageView()

      initUsersnap()
    }
  }, [analyticsEnabled, initUsersnap])

  return null
}
