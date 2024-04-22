import { useCallback } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'

import { axiosInstance } from '@/api/axios'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useSnackbar } from '@/providers/snackbars'
import { useYppStore } from '@/providers/ypp/ypp.store'
import { SentryLogger } from '@/utils/logs'
import { useGetYppSyncedChannels } from '@/views/global/YppLandingView/useGetYppSyncedChannels'

export const SINGUP_DAILY_QUOTA = 500 // 2% of the total daily quota

export const useYppAuthorizeHandler = () => {
  const { displaySnackbar } = useSnackbar()

  const navigate = useNavigate()
  const { trackYppSignInButtonClick } = useSegmentAnalytics()
  const yppModalOpenName = useYppStore((state) => state.yppModalOpenName)
  const setYppModalOpen = useYppStore((state) => state.actions.setYppModalOpenName)
  const { data } = useQuery('ypp-quota-fetch', () =>
    axiosInstance
      .get<{ signupQuotaUsed: number }>(`${atlasConfig.features.ypp.youtubeSyncApiUrl}/youtube/quota-usage/today`)
      .then((res) => res.data)
      .catch((e) => SentryLogger.error('Quota fetch failed', 'YppLandingView', e))
  )
  const isTodaysQuotaReached = data ? data.signupQuotaUsed > SINGUP_DAILY_QUOTA : false
  const { currentChannel } = useGetYppSyncedChannels()

  const isYppSigned = !!currentChannel

  return useCallback(() => {
    if (isTodaysQuotaReached) {
      displaySnackbar({
        title: 'Something went wrong',
        description:
          "Due to high demand, we've reached the quota on the daily new sign ups. Please try again tomorrow.",
        iconType: 'error',
      })
      return false
    }

    if (isYppSigned) {
      navigate(absoluteRoutes.studio.yppDashboard())
      return false
    }

    if (!yppModalOpenName) {
      trackYppSignInButtonClick()
      setYppModalOpen('ypp-requirements')
      return true
    }
  }, [
    isTodaysQuotaReached,
    isYppSigned,
    yppModalOpenName,
    displaySnackbar,
    navigate,
    trackYppSignInButtonClick,
    setYppModalOpen,
  ])
}
