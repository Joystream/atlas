import AOS from 'aos'
import 'aos/dist/aos.css'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
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
  const { unsyncedChannels, syncedChannels, isLoading } = useGetYppSyncedChannels()
  const setSelectedChannelId = useYppStore((store) => store.actions.setSelectedChannelId)

  const selectedChannelTitle = activeMembership?.channels.find((channel) => channel.id === channelId)?.title

  const navigate = useNavigate()

  const channels = activeMembership?.channels

  const isYppSigned = useMemo(
    () => !!syncedChannels?.find((syncedChannels) => syncedChannels.joystreamChannelId.toString() === channelId),
    [channelId, syncedChannels]
  )

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
      // TODO: somehow continue the flow automatically once user is logged in
      return
    }
    if (!channels?.length) {
      navigate(absoluteRoutes.studio.signIn())
      // TODO: trigger "Already YouTube creator?" modal after user creates a channel
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
        <YppThreeStepsSection />
        <YppCardsSections />
        <YppFooter />
      </ParallaxProvider>
    </Wrapper>
  )
}
