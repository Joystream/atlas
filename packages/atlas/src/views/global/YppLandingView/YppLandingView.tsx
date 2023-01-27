import AOS from 'aos'
import 'aos/dist/aos.css'
import axios from 'axios'
import { FC, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ParallaxProvider } from 'react-scroll-parallax'

import { YppReferralBanner } from '@/components/_ypp/YppReferralBanner'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useHeadTags } from '@/hooks/useHeadTags'
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
  const [isTodaysQuotaReached, setIsTodaysQuotaReached] = useState<boolean>(false)
  const { isLoggedIn, signIn, activeMembership, channelId, walletStatus } = useUser()
  const { setSelectedChannelId, setShouldContinueYppFlow } = useYppStore((store) => store.actions)
  const { displaySnackbar } = useSnackbar()
  const selectedChannelTitle = activeMembership?.channels.find((channel) => channel.id === channelId)?.title

  const shouldContinueYppFlow = useYppStore((store) => store.shouldContinueYppFlow)

  const navigate = useNavigate()

  const channels = activeMembership?.channels

  const { unsyncedChannels, isLoading, currentChannel } = useGetYppSyncedChannels()
  const isYppSigned = !!currentChannel

  const hasAnotherUnsyncedChannel = isYppSigned && !!unsyncedChannels?.length

  useEffect(() => {
    AOS.init({
      duration: 750,
      once: true,
    })
  }, [])

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const { data } = await axios.get(`${atlasConfig.features.ypp.youtubeSyncApiUrl}/youtube/quota-usage/today`)
        if (data.signupQuotaUsed > SINGUP_DAILY_QUOTA) {
          setIsTodaysQuotaReached(true)
        }
      } catch (e) {
        SentryLogger.error('Quota fetch failed', 'YppLandingView', e)
      }
    }

    fetchQuota()
  }, [])

  const handleSignUpClick = useCallback(() => {
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
      signIn()
      return
    }
    if (!channels?.length) {
      navigate(absoluteRoutes.studio.signIn())
      return
    }
    if (isYppSigned) {
      navigate(absoluteRoutes.studio.ypp())
      return
    }
    if (unsyncedChannels?.length) {
      setSelectedChannelId(unsyncedChannels[0].id)
    }
    if (unsyncedChannels?.length && unsyncedChannels.length > 1) {
      setCurrentStep('select-channel')
    } else {
      setCurrentStep('requirements')
    }
  }, [
    channels?.length,
    isLoggedIn,
    isYppSigned,
    navigate,
    setSelectedChannelId,
    signIn,
    unsyncedChannels,
    isTodaysQuotaReached,
    displaySnackbar,
  ])

  useEffect(() => {
    if (shouldContinueYppFlow) {
      setSelectedChannelId(channelId)
      setShouldContinueYppFlow(false)
      setCurrentStep('requirements')
    }
  }, [channelId, handleSignUpClick, setSelectedChannelId, setShouldContinueYppFlow, shouldContinueYppFlow])

  const getYppAtlasStatus = () => {
    if (isLoading) {
      return null
    }

    if (walletStatus !== 'connected') {
      return 'connect-wallet'
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
      <YppAuthorizationModal
        unSyncedChannels={unsyncedChannels}
        currentStep={currentStep}
        onChangeStep={setCurrentStep}
      />
      <ParallaxProvider>
        <YppReferralBanner />
        <YppHero
          onSelectChannel={() => setCurrentStep('select-channel')}
          onSignUpClick={handleSignUpClick}
          yppAtlasStatus={getYppAtlasStatus()}
          hasAnotherUnsyncedChannel={hasAnotherUnsyncedChannel}
          selectedChannelTitle={selectedChannelTitle}
        />
        <YppRewardSection />
        <YppThreeStepsSection onSignUpClick={handleSignUpClick} yppStatus={getYppAtlasStatus()} />
        <YppCardsSections />
        <YppFooter onSignUpClick={handleSignUpClick} />
      </ParallaxProvider>
    </Wrapper>
  )
}
