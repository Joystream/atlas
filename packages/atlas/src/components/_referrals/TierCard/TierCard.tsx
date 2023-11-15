import {
  SvgActionCheck,
  SvgIconRankBronzeMonochrome,
  SvgIconRankDiamondMonochrome,
  SvgIconRankGoldMonochrome,
  SvgIconRankSilverMonochrome,
} from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import {
  ContentWrapper,
  RewardWrapper,
  StyledPriceWrapper,
  TierBanner,
  Wrapper,
} from '@/components/_referrals/TierCard/TierCard.styles'
import { atlasConfig } from '@/config'
import { capitalizeFirstLetter } from '@/utils/misc'
import { getTierRewards } from '@/utils/ypp'
import { TickWrapper } from '@/views/global/YppLandingView/YppAuthorizationModal/YppAuthorizationSteps/YppAuthorizationRequirementsStep/YppAuthorizationRequirementsStep.styles'

export type Tier = 'bronze' | 'silver' | 'gold' | 'diamond'

export type TierCardProps = {
  tier: Tier
  reqs: string[]
}

export const getTierIcon = (tier: TierCardProps['tier']) => {
  switch (tier) {
    case 'diamond':
      return <SvgIconRankDiamondMonochrome />
    case 'gold':
      return <SvgIconRankGoldMonochrome />
    case 'silver':
      return <SvgIconRankSilverMonochrome />
    case 'bronze':
    default:
      return <SvgIconRankBronzeMonochrome />
  }
}

export const TierCard = ({ reqs, tier }: TierCardProps) => {
  const signupMultiplier = tier === 'bronze' ? 1 : atlasConfig.features.ypp.tierBoostMultiplier || 1
  const referralReward = (getTierRewards(tier)?.referral || 0) * signupMultiplier
  return (
    <Wrapper>
      <TierBanner tier={tier}>
        <FlexBox flow="column" gap={1.5} alignItems="center">
          {getTierIcon(tier)}
          <Text variant="t100-strong" as="p">
            {capitalizeFirstLetter(tier)}
          </Text>
        </FlexBox>
        <div className="absolute-container">
          <svg>
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="1" numOctaves="1" stitchTiles="stitch" />
              <feBlend in="SourceGraphic" in2="colorNoise" mode="multiply" />
            </filter>
          </svg>
        </div>
      </TierBanner>

      <ContentWrapper gap={2} flow="column">
        <FlexBox flow="column" gap={2} width="100%">
          {reqs.map((req, idx) => (
            <FlexBox key={idx} gap={2}>
              <TickWrapper fulfilled>
                <SvgActionCheck />
              </TickWrapper>
              <Text variant="t200" align="left" as="p" color="colorText">
                {req}
              </Text>
            </FlexBox>
          ))}
        </FlexBox>
        <RewardWrapper>
          <Text variant="t200" align="left" as="p" color="colorText">
            Earn for Referring
          </Text>
          <StyledPriceWrapper variant="t200-strong" as="p">
            +${referralReward} USD
          </StyledPriceWrapper>
        </RewardWrapper>
      </ContentWrapper>
    </Wrapper>
  )
}
