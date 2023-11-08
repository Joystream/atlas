import AOS from 'aos'
import 'aos/dist/aos.css'
import { FC, useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ParallaxProvider } from 'react-scroll-parallax'

import { YppReferralBanner } from '@/components/_ypp/YppReferralBanner'
import { absoluteRoutes } from '@/config/routes'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useUser } from '@/providers/user/user.hooks'
import { useYppStore } from '@/providers/ypp/ypp.store'
import { YppConnectionDetails } from '@/views/global/YppLandingView/sections/YppConnectionDetails'

import { YppAuthorizationModal } from './YppAuthorizationModal'
import { Wrapper } from './YppLandingView.styles'
import { YppCardsSections } from './sections/YppCardsSections'
import { YppFooter } from './sections/YppFooter'
import { YppHero } from './sections/YppHero'
import { YppRewardSection } from './sections/YppRewardSection'
import { YppSignupVideo } from './sections/YppSignupVideo'
import { useGetYppSyncedChannels } from './useGetYppSyncedChannels'

export const YppLandingView: FC = () => {
  const headTags = useHeadTags('YouTube Partner Program')
  const yppModalOpenName = useYppStore((state) => state.yppModalOpenName)
  const setYppModalOpen = useYppStore((state) => state.actions.setYppModalOpenName)
  const { activeMembership, channelId } = useUser()
  const [searchParams] = useSearchParams()
  const { setSelectedChannelId, setShouldContinueYppFlowAfterCreatingChannel } = useYppStore((store) => store.actions)
  const navigate = useNavigate()
  const { trackYppSignInButtonClick } = useSegmentAnalytics()
  const selectedChannelTitle = activeMembership?.channels.find((channel) => channel.id === channelId)?.title

  const [wasSignInTriggered, setWasSignInTriggered] = useState(false)
  const shouldContinueYppFlowAfterCreatingChannel = useYppStore(
    (store) => store.shouldContinueYppFlowAfterCreatingChannel
  )
  const [referrer, utmSource, utmCampaign] = [
    searchParams.get('referrerId'),
    searchParams.get('utm_source'),
    searchParams.get('utm_campaign'),
  ]

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
    if (isYppSigned) {
      navigate(absoluteRoutes.studio.yppDashboard())
      return
    }

    if (!yppModalOpenName) {
      trackYppSignInButtonClick(referrer, utmSource, utmCampaign)
      setYppModalOpen('ypp-requirements')
      return
    }
  }, [
    isYppSigned,
    yppModalOpenName,
    navigate,
    trackYppSignInButtonClick,
    referrer,
    utmSource,
    utmCampaign,
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
        <YppSignupVideo />
        <YppConnectionDetails />
        <YppCardsSections />
        <YppFooter onSignUpClick={handleYppSignUpClick} />
      </ParallaxProvider>
    </Wrapper>
  )
}
