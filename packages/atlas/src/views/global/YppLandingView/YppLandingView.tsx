import AOS from 'aos'
import 'aos/dist/aos.css'
import axios from 'axios'
import { FC, useCallback, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { ParallaxProvider } from 'react-scroll-parallax'

import { YppReferralBanner } from '@/components/_ypp/YppReferralBanner'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useAuthStore } from '@/providers/auth/auth.store'
import { useSnackbar } from '@/providers/snackbars'
import { useUser } from '@/providers/user/user.hooks'
import { useYppStore } from '@/providers/ypp/ypp.store'
import { SentryLogger } from '@/utils/logs'

import { YppAuthorizationModal } from './YppAuthorizationModal'
import { YppAuthorizationStepsType } from './YppAuthorizationModal/YppAuthorizationModal.types'
import { YppCardsSections } from './YppCardsSections'
import { YppFooter } from './YppFooter'
import { YppHero } from './YppHero'
import { useGetYppSyncedChannels } from './YppLandingView.hooks'
import { Wrapper } from './YppLandingView.styles'
import { YppRewardSection } from './YppRewardSection'
import { YppThreeStepsSection } from './YppThreeStepsSection'

const SINGUP_DAILY_QUOTA = 500 // 2% of the total daily quota

export const YppLandingView: FC = () => {
  const headTags = useHeadTags('YouTube Partner Program')
  const [currentStep, setCurrentStep] = useState<YppAuthorizationStepsType>(null)
  const { isLoggedIn, activeMembership, channelId } = useUser()
  const {
    actions: { setAuthModalOpen },
  } = useAuthStore()
  const { setSelectedChannelId, setShouldContinueYppFlow } = useYppStore((store) => store.actions)
  const { displaySnackbar } = useSnackbar()
  const navigate = useNavigate()
  const selectedChannelTitle = activeMembership?.channels.find((channel) => channel.id === channelId)?.title
  const { data } = useQuery('ypp-quota-fetch', () =>
    axios
      .get<{ signupQuotaUsed: number }>(`${atlasConfig.features.ypp.youtubeSyncApiUrl}/youtube/quota-usage/today`)
      .then((res) => res.data)
      .catch((e) => SentryLogger.error('Quota fetch failed', 'YppLandingView', e))
  )
  const [wasSignInTriggered, setWasSignInTriggered] = useState(false)
  const isTodaysQuotaReached = data ? data.signupQuotaUsed > SINGUP_DAILY_QUOTA : false
  const shouldContinueYppFlow = useYppStore((store) => store.shouldContinueYppFlow)

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

    if (!isLoggedIn) {
      setAuthModalOpen('externalLogIn')
      setWasSignInTriggered(true)
      return
    }

    if (isYppSigned) {
      navigate(absoluteRoutes.studio.ypp())
      return
    }

    if (!currentStep) {
      setCurrentStep('requirements')
      return
    }
  }, [currentStep, displaySnackbar, isLoggedIn, isTodaysQuotaReached, isYppSigned, navigate, setAuthModalOpen])

  useEffect(() => {
    // rerun handleYppSignUpClick after sign in flow
    if (wasSignInTriggered) {
      handleYppSignUpClick()
      setWasSignInTriggered(false)
    }
  }, [handleYppSignUpClick, wasSignInTriggered])

  useEffect(() => {
    if (shouldContinueYppFlow) {
      setSelectedChannelId(channelId)
      setShouldContinueYppFlow(false)
      setCurrentStep('requirements')
    }
  }, [channelId, handleYppSignUpClick, setSelectedChannelId, setShouldContinueYppFlow, shouldContinueYppFlow])

  const getYppAtlasStatus = () => {
    if (isLoading) {
      return null
    }
    // todo: replace
    // if (walletStatus !== 'connected') {
    //   return 'connect-wallet'
    // }

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
      <YppAuthorizationModal
        unSyncedChannels={unsyncedChannels}
        currentStep={currentStep}
        onChangeStep={setCurrentStep}
      />
      <ParallaxProvider>
        <YppReferralBanner />
        <YppHero
          onSelectChannel={() => setCurrentStep('select-channel')}
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
