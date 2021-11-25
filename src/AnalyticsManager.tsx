import ls from '@livesession/sdk'
import React, { useCallback, useEffect } from 'react'
import useHotjar from 'react-use-hotjar'

import { BUILD_ENV, readEnv } from '@/config/envs'

export const AnalyticsManager: React.FC = () => {
  const { initHotjar } = useHotjar()
  const analyticsEnabled = BUILD_ENV === 'production'

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
      // eslint-disable-next-line no-console
      initHotjar(parseInt(readEnv('HOTJAR_ID')), 6, false, console.info)

      ls.init(readEnv('LIVESESSION_ID'), { keystrokes: true, rootHostname: '.joystream.org' })
      ls.newPageView()

      initUsersnap()
    }
  }, [analyticsEnabled, initHotjar, initUsersnap])

  return null
}
