import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ParallaxProvider } from 'react-scroll-parallax'

import { YppReferralBanner } from '@/components/_ypp/YppReferralBanner'
import { absoluteRoutes } from '@/config/routes'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useUser } from '@/providers/user/user.hooks'

import { YppAuthorizationModal } from './YppAuthorizationModal'
import { YppCardsSections } from './YppCardsSections'
import { YppFooter } from './YppFooter'
import { YppHero } from './YppHero'
import { YppRewardSection } from './YppRewardSection'
import { YppThreeStepsSection } from './YppThreeStepsSection'

export const YppLandingView: FC = () => {
  const headTags = useHeadTags('Youtube Partner Program')
  const [currentAuthStepIdx, setCurrentAuthStepIdx] = useState<number | null>(null)
  const { isLoggedIn, signIn } = useUser()

  const navigate = useNavigate()

  const { activeMembership } = useUser()
  const channels = activeMembership?.channels

  const handleSignUpClick = () => {
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
    setCurrentAuthStepIdx(0)
  }

  return (
    <>
      {headTags}
      <YppAuthorizationModal currentStepIdx={currentAuthStepIdx} setCurrentStepIdx={setCurrentAuthStepIdx} />
      <ParallaxProvider>
        <YppReferralBanner />
        <YppHero onSignUpClick={handleSignUpClick} />
        <YppRewardSection />
        <YppThreeStepsSection />
        <YppCardsSections />
        <YppFooter />
      </ParallaxProvider>
    </>
  )
}
