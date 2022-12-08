import AOS from 'aos'
import 'aos/dist/aos.css'
import { FC, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ParallaxProvider } from 'react-scroll-parallax'

import { YppReferralBanner } from '@/components/_ypp/YppReferralBanner'
import { absoluteRoutes } from '@/config/routes'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useUser } from '@/providers/user/user.hooks'
import { useYppStore } from '@/providers/ypp/ypp.store'

import { YppAuthorizationModal } from './YppAuthorizationModal'
import { YppAuthorizationStepsType } from './YppAuthorizationModal/YppAuthorizationModal.types'
import { YppCardsSections } from './YppCardsSections'
import { YppFooter } from './YppFooter'
import { YppHero } from './YppHero'
import { useGetYppSyncedChannels } from './YppLandingView.hooks'
import { Wrapper } from './YppLandingView.styles'
import { YppRewardSection } from './YppRewardSection'
import { YppThreeStepsSection } from './YppThreeStepsSection'

export const YppLandingView: FC = () => {
  const headTags = useHeadTags('Youtube Partner Program')
  const [currentStep, setCurrentStep] = useState<YppAuthorizationStepsType>(null)
  const { isLoggedIn, signIn, activeMembership, channelId } = useUser()
  const { setSelectedChannelId, setShouldContinueYppFlow } = useYppStore((store) => store.actions)

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

  const handleSignUpClick = useCallback(() => {
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
  }, [channels?.length, isLoggedIn, isYppSigned, navigate, setSelectedChannelId, signIn, unsyncedChannels])

  useEffect(() => {
    if (shouldContinueYppFlow) {
      setSelectedChannelId(channelId)
      setShouldContinueYppFlow(false)
      setCurrentStep('requirements')
    }
  }, [channelId, handleSignUpClick, setSelectedChannelId, setShouldContinueYppFlow, shouldContinueYppFlow])

  const getYppStatus = () => {
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
          yppStatus={getYppStatus()}
          hasAnotherUnsyncedChannel={hasAnotherUnsyncedChannel}
          selectedChannelTitle={selectedChannelTitle}
        />
        <YppRewardSection />
        <YppThreeStepsSection onSignUpClick={handleSignUpClick} />
        <YppCardsSections />
        <YppFooter onSignUpClick={handleSignUpClick} />
      </ParallaxProvider>
    </Wrapper>
  )
}
