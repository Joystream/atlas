import AOS from 'aos'
import 'aos/dist/aos.css'
import { FC, useEffect, useState } from 'react'
import { ParallaxProvider } from 'react-scroll-parallax'

import { YppReferralBanner } from '@/components/_ypp/YppReferralBanner'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useYppAuthorizeHandler } from '@/hooks/useYppAuthorizeHandler'
import { useUser } from '@/providers/user/user.hooks'
import { useYppStore } from '@/providers/ypp/ypp.store'

import { YppAuthorizationModal } from './YppAuthorizationModal'
import { YppCardsSections } from './YppCardsSections'
import { YppFooter } from './YppFooter'
import { YppHero } from './YppHero'
import { Wrapper } from './YppLandingView.styles'
import { YppRewardSection } from './YppRewardSection'
import { useGetYppSyncedChannels } from './useGetYppSyncedChannels'

export const YppLandingView: FC = () => {
  const headTags = useHeadTags('YouTube Partner Program')
  const setYppModalOpen = useYppStore((state) => state.actions.setYppModalOpenName)
  const { activeMembership, channelId } = useUser()
  const { setSelectedChannelId, setShouldContinueYppFlowAfterCreatingChannel } = useYppStore((store) => store.actions)

  const selectedChannelTitle = activeMembership?.channels.find((channel) => channel.id === channelId)?.title
  const [wasSignInTriggered, setWasSignInTriggered] = useState(false)
  const shouldContinueYppFlowAfterCreatingChannel = useYppStore(
    (store) => store.shouldContinueYppFlowAfterCreatingChannel
  )

  const { unsyncedChannels, isLoading, currentChannel } = useGetYppSyncedChannels()
  const isYppSigned = !!currentChannel
  const hasAnotherUnsyncedChannel = isYppSigned && !!unsyncedChannels?.length
  const handleYppSignUpClick = useYppAuthorizeHandler()

  useEffect(() => {
    AOS.init({
      duration: 750,
      once: true,
    })
  }, [])

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
        <YppCardsSections />
        <YppFooter onSignUpClick={handleYppSignUpClick} />
      </ParallaxProvider>
    </Wrapper>
  )
}
