import {
  SvgActionCheck,
  SvgIconRankBronzeMonochrome,
  SvgIconRankDiamondMonochrome,
  SvgIconRankGoldMonochrome,
  SvgIconRankSilverMonochrome,
} from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { ContentWrapper, RewardWrapper, TierBanner, Wrapper } from '@/components/_referrals/TierCard/TierCard.styles'
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
  const referralReward = getTierRewards(tier)?.referral
  return (
    <Wrapper>
      <TierBanner tier={tier}>
        <FlexBox flow="column" gap={1.5} alignItems="center">
          {getTierIcon(tier)}
          <Text variant="t100-strong" as="p">
            {capitalizeFirstLetter(tier)}
          </Text>
        </FlexBox>
        <svg>
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="1" numOctaves="1" stitchTiles="stitch" />
            <feBlend in="SourceGraphic" in2="colorNoise" mode="multiply" />
          </filter>
        </svg>
      </TierBanner>

      <ContentWrapper gap={2} flow="column">
        <FlexBox flow="column" gap={2} width="100%">
          {reqs.map((req, idx) => (
            <FlexBox key={idx} gap={1}>
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
          <Text variant="t200" as="p" color="colorText">
            Earn for Referring
          </Text>
          <Text variant="t200-strong" as="p">
            +${referralReward} USD
          </Text>
        </RewardWrapper>
      </ContentWrapper>
    </Wrapper>
  )
}
