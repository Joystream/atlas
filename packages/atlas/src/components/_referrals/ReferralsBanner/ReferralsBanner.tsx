import { useNavigate } from 'react-router-dom'

import ListImage from '@/assets/images/referrals-landing/referrals-list.webp'
import { StyledBanner, StyledScrollingList } from '@/components/_referrals/ReferralsBanner/ReferralsBanner.styled'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { getTierRewards } from '@/utils/ypp'

export const ReferralsBanner = () => {
  const referralMultiplier = atlasConfig.features.ypp.tierBoostMultiplier || 1
  const navigate = useNavigate()
  const referralReward = (getTierRewards('diamond')?.referral || 0) * referralMultiplier

  return (
    <StyledBanner
      title={`Earn up to $${referralReward} for referring a channel`}
      description="Learn more about referrals"
      dismissibleId="referrals-banner"
      size="small"
      actionButton={{
        text: 'Learn more',
        onClick: () => navigate(absoluteRoutes.viewer.referrals()),
        variant: 'secondary',
        _textOnly: false,
      }}
      rightActionButton
    >
      <StyledScrollingList src={ListImage} />
    </StyledBanner>
  )
}
