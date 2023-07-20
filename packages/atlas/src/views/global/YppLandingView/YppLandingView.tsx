import AOS from 'aos'
import 'aos/dist/aos.css'
import axios from 'axios'
import { FC, useCallback, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ParallaxProvider } from 'react-scroll-parallax'

import { YppReferralBanner } from '@/components/_ypp/YppReferralBanner'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useSnackbar } from '@/providers/snackbars'
import { useUser } from '@/providers/user/user.hooks'
import { useYppStore } from '@/providers/ypp/ypp.store'
import { SentryLogger } from '@/utils/logs'

import { YppAuthorizationModal } from './YppAuthorizationModal'
import { YppCardsSections } from './YppCardsSections'
import { YppFooter } from './YppFooter'
import { YppHero } from './YppHero'
import { Wrapper } from './YppLandingView.styles'
import { YppRewardSection } from './YppRewardSection'
import { YppThreeStepsSection } from './YppThreeStepsSection'
import { useGetYppSyncedChannels } from './useGetYppSyncedChannels'

const SINGUP_DAILY_QUOTA = 500 // 2% of the total daily quota

export const YppLandingView: FC = () => {
  const headTags = useHeadTags('YouTube Partner Program')
  const yppModalOpenName = useYppStore((state) => state.yppModalOpenName)
  const setYppModalOpen = useYppStore((state) => state.actions.setYppModalOpenName)
  const { activeMembership, channelId } = useUser()
  const [searchParams] = useSearchParams()
  const { setSelectedChannelId, setShouldContinueYppFlowAfterCreatingChannel } = useYppStore((store) => store.actions)
  const { displaySnackbar } = useSnackbar()
  const navigate = useNavigate()
  const { trackYppSignInButtonClick } = useSegmentAnalytics()
  const selectedChannelTitle = activeMembership?.channels.find((channel) => channel.id === channelId)?.title
  const { data } = useQuery('ypp-quota-fetch', () =>
    axios
      .get<{ signupQuotaUsed: number }>(`${atlasConfig.features.ypp.youtubeSyncApiUrl}/youtube/quota-usage/today`)
      .then((res) => res.data)
      .catch((e) => SentryLogger.error('Quota fetch failed', 'YppLandingView', e))
  )
  const [wasSignInTriggered, setWasSignInTriggered] = useState(false)
  const isTodaysQuotaReached = data ? data.signupQuotaUsed > SINGUP_DAILY_QUOTA : false
  const shouldContinueYppFlowAfterCreatingChannel = useYppStore(
    (store) => store.shouldContinueYppFlowAfterCreatingChannel
  )
  const [referrer, utmSource] = [searchParams.get('referrerId'), searchParams.get('utm_source')]

  const { unsyncedChannels, isLoading, currentChannel } = useGetYppSyncedChannels()
  const isYppSigned = !!currentChannel
  const hasAnotherUnsyncedChannel = isYppSigned && !!unsyncedChannels?.length

  useEffect(() => {
    AOS.init({
      duration: 750,
      once: true,
    })
  }, [])

  const handleYppSignUpClick = useCallback(async () => {
    if (isTodaysQuotaReached) {
      displaySnackbar({
        title: 'Something went wrong',
        description:
          "Due to high demand, we've reached the quota on the daily new sign ups. Please try again tomorrow.",
        iconType: 'error',
      })
      return
    }

    if (isYppSigned) {
      navigate(absoluteRoutes.studio.ypp())
      return
    }

    if (!yppModalOpenName) {
      trackYppSignInButtonClick(referrer, utmSource)
      setYppModalOpen('ypp-requirements')
      return
    }
  }, [
    isTodaysQuotaReached,
    isYppSigned,
    yppModalOpenName,
    displaySnackbar,
    navigate,
    trackYppSignInButtonClick,
    referrer,
    utmSource,
    setYppModalOpen,
  ])

  useEffect(() => {
    // rerun handleYppSignUpClick after sign in flow
    if (wasSignInTriggered) {
      handleYppSignUpClick()
      setWasSignInTriggered(false)
    }
  }, [handleYppSignUpClick, wasSignInTriggered])

  useEffect(() => {
    if (shouldContinueYppFlowAfterCreatingChannel) {
      setSelectedChannelId(channelId)
      setShouldContinueYppFlowAfterCreatingChannel(false)
      setYppModalOpen('ypp-requirements')
    }
  }, [
    channelId,
    handleYppSignUpClick,
    setSelectedChannelId,
    setShouldContinueYppFlowAfterCreatingChannel,
    setYppModalOpen,
    shouldContinueYppFlowAfterCreatingChannel,
  ])

  const getYppAtlasStatus = () => {
    if (isLoading) {
      return null
    }

    if (!activeMembership?.channels.length) {
      return 'no-channel'
    }
    if (isYppSigned) {
      return 'ypp-signed'
    }
    return 'have-channel'
  }

  return (
    <Wrapper>
      {headTags}
      <YppAuthorizationModal unSyncedChannels={unsyncedChannels} />
      <ParallaxProvider>
        <YppReferralBanner />
        <YppHero
          onSelectChannel={() => setYppModalOpen('ypp-select-channel')}
          onSignUpClick={handleYppSignUpClick}
          yppAtlasStatus={getYppAtlasStatus()}
          hasAnotherUnsyncedChannel={hasAnotherUnsyncedChannel}
          selectedChannelTitle={selectedChannelTitle}
        />
        <YppRewardSection />
        <YppThreeStepsSection onSignUpClick={handleYppSignUpClick} yppStatus={getYppAtlasStatus()} />
        <YppCardsSections />
        <YppFooter onSignUpClick={handleYppSignUpClick} />
      </ParallaxProvider>
    </Wrapper>
  )
}
