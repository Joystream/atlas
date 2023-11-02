import { Avatar } from '@/components/Avatar'
import { FlexBox } from '@/components/FlexBox'
import { TierCard } from '@/components/_referrals/TierCard'
import { atlasConfig } from '@/config'
import {
  AvatarWrapper,
  StyledSideLine,
  StyledTierCardsWrapper,
  StyledVertLine,
  TiersGraphicWrapper,
} from '@/views/global/ReferralsView/sections/ReferralTiers/ReferralTiers.styles'

export const ReferralTiers = () => {
  const tiers = atlasConfig.features.ypp.tiersDefinition
  return (
    <FlexBox flow="column">
      <TiersGraphicWrapper>
        <StyledSideLine isRight={false} />
        <AvatarWrapper size={88}>
          <Avatar size={88} />
        </AvatarWrapper>
        <StyledVertLine />
        <StyledSideLine isRight={true} />
      </TiersGraphicWrapper>
      <StyledTierCardsWrapper>
        {tiers.map((tier) => (
          <TierCard key={tier.tier} {...tier} />
        ))}
      </StyledTierCardsWrapper>
    </FlexBox>
  )
}
