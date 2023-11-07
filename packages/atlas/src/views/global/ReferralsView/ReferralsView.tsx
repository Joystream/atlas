import { useEffect } from 'react'

import { useMediaMatch } from '@/hooks/useMediaMatch'
import { usePersonalDataStore } from '@/providers/personalData'
import { StyledLimitedWidthWrapper } from '@/views/global/ReferralsView/ReferralsView.styles'
import { ReferralSteps } from '@/views/global/ReferralsView/sections/ReferralSteps/ReferralSteps'
import { ReferralTiers } from '@/views/global/ReferralsView/sections/ReferralTiers/ReferralTiers'
import { ReferralsList } from '@/views/global/ReferralsView/sections/ReferralsList/ReferralsList'
import { ReferralsVideo } from '@/views/global/ReferralsView/sections/ReferralsVideo/ReferralsVideo'
import { TopReferrals } from '@/views/global/ReferralsView/sections/TopReferrals/TopReferrals'

export const ReferralsView = () => {
  const updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)
  useEffect(() => {
    updateDismissedMessages('referrals-banner')
  }, [updateDismissedMessages])

  const mdMatch = useMediaMatch('md')
  const xsMatch = useMediaMatch('xs')

  return (
    <StyledLimitedWidthWrapper
      flow="column"
      justifyContent="center"
      alignItems="center"
      gap={mdMatch ? 24 : xsMatch ? 18 : 14}
    >
      <ReferralsVideo />
      <ReferralTiers />
      {/*<ReferralLayers />*/}
      <ReferralSteps />
      <TopReferrals />
      <ReferralsList />
      <div />
    </StyledLimitedWidthWrapper>
  )
}
